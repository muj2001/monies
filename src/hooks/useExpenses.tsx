import { randomUUID } from "expo-crypto";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  appendExpense,
  loadLedger,
  restoreSignIn,
  signIn as googleSignIn,
  type Category,
  type Expense,
  type NewExpense,
} from "../lib/sheets";

export type { Category, Expense } from "../lib/sheets";

type Status = "checking" | "signedOut" | "loading" | "ready" | "error";

type ExpensesContextValue = {
  status: Status;
  error: string | null;
  categories: Category[];
  expenses: Expense[];
  signIn: () => Promise<void>;
  reload: () => Promise<void>;
  addExpense: (expense: NewExpense) => Promise<void>;
};

const ExpensesContext = createContext<ExpensesContextValue | null>(null);

function message(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

export function ExpensesProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<Status>("checking");
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [transactionColumns, setTransactionColumns] = useState<string[]>([]);

  const reload = async () => {
    setStatus("loading");
    setError(null);
    try {
      const ledger = await loadLedger();
      setCategories(ledger.categories);
      setExpenses(ledger.expenses);
      setTransactionColumns(ledger.transactionColumns);
      setStatus("ready");
    } catch (e) {
      setError(message(e));
      setStatus("error");
    }
  };

  const signIn = async () => {
    setError(null);
    try {
      if (await googleSignIn()) await reload();
    } catch (e) {
      setError(message(e));
      setStatus("signedOut");
    }
  };

  useEffect(() => {
    restoreSignIn()
      .then(signedIn => (signedIn ? reload() : setStatus("signedOut")))
      .catch(e => {
        setError(message(e));
        setStatus("signedOut");
      });
    // Runs once on launch to restore the previous Google session.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addExpense = async (expense: NewExpense) => {
    const id = randomUUID();
    const created_at = await appendExpense(transactionColumns, { ...expense, id });
    const category = categories.find(item => item.id === expense.category_id)?.title ?? "Uncategorized";
    setExpenses(current => [{ ...expense, id, category, created_at, archived: false }, ...current]);
  };

  return (
    <ExpensesContext.Provider value={{ status, error, categories, expenses, signIn, reload, addExpense }}>
      {children}
    </ExpensesContext.Provider>
  );
}

export function useExpenses() {
  return useContext(ExpensesContext)!;
}
