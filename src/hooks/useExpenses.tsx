import { createContext, useContext, useState, type ReactNode } from "react";

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

export const sampleCategories = [
  { id: "groceries", title: "Groceries" },
  { id: "transport", title: "Transport" },
  { id: "food", title: "Food" },
];

const sampleExpenses: Expense[] = [
  { id: "1", amount: 1250, description: "Milk and bread", category_id: "groceries", category: "Groceries", date: "2026-10-18", created_at: "2026-10-18T12:30:00", archived: false },
  { id: "2", amount: 500, description: "Ride home", category_id: "transport", category: "Transport", date: "2026-10-18", created_at: "2026-10-18T09:15:00", archived: false },
  { id: "3", amount: 2400, description: "Dinner", category_id: "food", category: "Food", date: "2026-10-17", created_at: "2026-10-17T20:00:00", archived: false },
];

type NewExpense = Pick<Expense, "amount" | "description" | "category_id" | "date">;
type ExpensesContextValue = {
  expenses: Expense[];
  addExpense: (expense: NewExpense) => void;
};

const ExpensesContext = createContext<ExpensesContextValue | null>(null);

export function ExpensesProvider({ children }: { children: ReactNode }) {
  const [expenses, setExpenses] = useState(sampleExpenses);

  const addExpense = (expense: NewExpense) => {
    const category = sampleCategories.find(item => item.id === expense.category_id)!;
    setExpenses(current => [
      {
        ...expense,
        id: `${Date.now()}-${current.length}`,
        category: category.title,
        created_at: new Date().toISOString(),
        archived: false,
      },
      ...current,
    ]);
  };

  return <ExpensesContext.Provider value={{ expenses, addExpense }}>{children}</ExpensesContext.Provider>;
}

export function useExpenses() {
  return useContext(ExpensesContext)!;
}
