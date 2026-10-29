import {
  GoogleSignin,
  isErrorWithCode,
  isNoSavedCredentialFoundResponse,
  isSuccessResponse,
  statusCodes,
} from "@react-native-google-signin/google-signin";

const SHEET_ID = process.env.EXPO_PUBLIC_SHEET_ID;
const TRANSACTIONS_TAB = "transactions";
const CATEGORIES_TAB = "categories";
const DAY_MS = 24 * 60 * 60 * 1000;
const SHEETS_EPOCH_MS = Date.UTC(1899, 11, 30);

GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_ID,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

export type Category = { id: string; title: string; description: string };

export type Expense = {
  id: string;
  amount: number;
  description: string;
  category_id: string;
  category: string;
  date: string;
  created_at: string;
  archived: boolean;
};

export type NewExpense = Pick<Expense, "amount" | "description" | "category_id" | "date">;

type Cell = string | number | boolean;
type Row = Record<string, Cell>;

export async function restoreSignIn() {
  return !isNoSavedCredentialFoundResponse(await GoogleSignin.signInSilently());
}

export async function signIn() {
  try {
    await GoogleSignin.hasPlayServices();
    return isSuccessResponse(await GoogleSignin.signIn());
  } catch (error) {
    if (isErrorWithCode(error) && error.code === statusCodes.IN_PROGRESS) return false;
    throw error;
  }
}

async function request(path: string, init: RequestInit = {}, retried = false): Promise<any> {
  if (!SHEET_ID) throw new Error("EXPO_PUBLIC_SHEET_ID is not set.");
  const { accessToken } = await GoogleSignin.getTokens();
  const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values${path}`, {
    ...init,
    headers: { ...init.headers, Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
  });
  // Android can hand back an expired cached token; clearing it makes getTokens fetch a fresh one.
  if (response.status === 401 && !retried) {
    await GoogleSignin.clearCachedAccessToken(accessToken);
    return request(path, init, true);
  }
  if (!response.ok) throw new Error(`Google Sheets request failed (${response.status}): ${await response.text()}`);
  return response.json();
}

function toRows(values: Cell[][] = []) {
  const [header = [], ...rows] = values;
  const columns = header.map(name => String(name).trim());
  return {
    columns,
    rows: rows.map(row => Object.fromEntries(columns.map((name, i) => [name, row[i] ?? ""])) as Row),
  };
}

// Sheets returns dates as day counts from 1899-12-30 when asked for SERIAL_NUMBER.
function toIsoDateTime(value: Cell) {
  if (typeof value !== "number") return String(value);
  return new Date(SHEETS_EPOCH_MS + Math.round(value * DAY_MS)).toISOString().slice(0, 19);
}

function sheetDateTime(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

export async function loadLedger() {
  const ranges = [CATEGORIES_TAB, TRANSACTIONS_TAB].map(range => `ranges=${encodeURIComponent(range)}`).join("&");
  const { valueRanges } = await request(
    `:batchGet?${ranges}&valueRenderOption=UNFORMATTED_VALUE&dateTimeRenderOption=SERIAL_NUMBER`
  );
  const categoryRows = toRows(valueRanges[0].values);
  const transactionRows = toRows(valueRanges[1].values);

  const categories: Category[] = categoryRows.rows
    .filter(row => String(row.id) !== "")
    .map(row => ({ id: String(row.id), title: String(row.title), description: String(row.description) }));
  const titles = new Map(categories.map(category => [category.id, category.title]));

  const expenses: Expense[] = transactionRows.rows
    .filter(row => String(row.id) !== "")
    .map(row => ({
      id: String(row.id),
      amount: Number(row.amount),
      description: String(row.description),
      category_id: String(row.category_id),
      category: titles.get(String(row.category_id)) ?? (String(row.category) || "Uncategorized"),
      date: toIsoDateTime(row.date).slice(0, 10),
      created_at: toIsoDateTime(row.created_at),
      archived: row.archived === true || String(row.archived).toUpperCase() === "TRUE",
    }));

  return { categories, expenses, transactionColumns: transactionRows.columns };
}

export async function appendExpense(transactionColumns: string[], expense: NewExpense & { id: string }) {
  if (!transactionColumns.includes("id")) throw new Error(`The ${TRANSACTIONS_TAB} sheet needs a header row with an id column.`);
  const createdAt = new Date();
  const cells: Record<string, Cell> = {
    id: expense.id,
    amount: expense.amount,
    // Leading apostrophe keeps user text from being parsed as a formula.
    description: expense.description ? `'${expense.description}` : "",
    category_id: expense.category_id,
    date: expense.date,
    created_at: sheetDateTime(createdAt),
    archived: false,
  };
  // null leaves a cell untouched, so formula columns such as `category` are not overwritten.
  const row = transactionColumns.map(column => cells[column] ?? null);

  await request(
    `/${encodeURIComponent(TRANSACTIONS_TAB)}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
    { method: "POST", body: JSON.stringify({ values: [row] }) }
  );

  return sheetDateTime(createdAt).replace(" ", "T");
}
