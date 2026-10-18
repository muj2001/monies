import { Box, Card, FloatingActionButton, Host, LazyColumn, ListItem, Text } from "@expo/ui/jetpack-compose";
import { align, fillMaxSize, fillMaxWidth, offset, padding } from "@expo/ui/jetpack-compose/modifiers";
import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

type Expense = {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  created_at: string;
};

const sampleExpenses: Expense[] = [
  { id: "1", amount: 1250, category: "Groceries", description: "Milk and bread", date: "2026-10-18", created_at: "2026-10-18T12:30:00" },
  { id: "2", amount: 500, category: "Transport", description: "Ride home", date: "2026-10-18", created_at: "2026-10-18T09:15:00" },
  { id: "3", amount: 2400, category: "Food", description: "Dinner", date: "2026-10-17", created_at: "2026-10-17T20:00:00" },
];

const sortedExpenses = [...sampleExpenses].sort(
  (a, b) => b.date.localeCompare(a.date) || b.created_at.localeCompare(a.created_at)
);

const groups: { date: string; expenses: Expense[] }[] = [];
for (const expense of sortedExpenses) {
  const lastGroup = groups[groups.length - 1];
  if (lastGroup?.date === expense.date) {
    lastGroup.expenses.push(expense);
  } else {
    groups.push({ date: expense.date, expenses: [expense] });
  }
}

const amountFormat = new Intl.NumberFormat("en-PK");
const dateFormat = new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" });

export default function Index() {
  return (
    <>
      <Stack.Screen options={{ headerTitle: "Monies" }} />
      <SafeAreaView edges={["bottom"]} style={{ flex: 1 }}>
        <Host style={{ flex: 1 }}>
          <Box modifiers={[fillMaxSize()]}>
            {groups.length === 0 ? (
              <Box modifiers={[fillMaxSize()]} contentAlignment="center">
                <Text>No expenses yet.</Text>
              </Box>
            ) : (
              <LazyColumn modifiers={[fillMaxSize()]} contentPadding={{ bottom: 144 }}>
                {groups.flatMap(group => [
                  <Text key={group.date} style={{ typography: "titleSmall" }} modifiers={[padding(16, 20, 16, 8)]}>
                    {dateFormat.format(new Date(`${group.date}T00:00:00`))}
                  </Text>,
                  ...group.expenses.map(expense => (
                    <Card key={expense.id} colors={{ containerColor: "#fff" }} modifiers={[padding(16, 0, 16, 12), fillMaxWidth()]}>
                      <ListItem colors={{ containerColor: "#fff" }}>
                        <ListItem.HeadlineContent><Text>{expense.category}</Text></ListItem.HeadlineContent>
                        <ListItem.SupportingContent><Text>{expense.description}</Text></ListItem.SupportingContent>
                        <ListItem.TrailingContent><Text>PKR {amountFormat.format(expense.amount)}</Text></ListItem.TrailingContent>
                      </ListItem>
                    </Card>
                  )),
                ])}
              </LazyColumn>
            )}
            <FloatingActionButton modifiers={[align("bottomEnd"), offset(-16, -16)]}>
              <FloatingActionButton.Icon><Text style={{ fontSize: 28 }}>+</Text></FloatingActionButton.Icon>
            </FloatingActionButton>
          </Box>
        </Host>
      </SafeAreaView>
    </>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//   },
// });
