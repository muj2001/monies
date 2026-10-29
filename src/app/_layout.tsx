import { Stack } from "expo-router";
import { ExpensesProvider } from "../hooks/useExpenses";

export default function RootLayout() {
  return (
    <ExpensesProvider>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#6200EE" }, // Purple header background
          headerTintColor: "#fff",                     // White text/back arrow
          headerTitleStyle: { fontWeight: "bold" },
        }}
      />
    </ExpensesProvider>
  );
}
