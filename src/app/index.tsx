import {
  Box,
  Button,
  Card,
  CircularProgressIndicator,
  Column,
  FloatingActionButton,
  Host,
  LazyColumn,
  ListItem,
  Text,
} from "@expo/ui/jetpack-compose";
import { align, fillMaxSize, fillMaxWidth, offset, padding } from "@expo/ui/jetpack-compose/modifiers";
import { Stack, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useExpenses, type Expense } from "../hooks/useExpenses";

const amountFormat = new Intl.NumberFormat("en-PK");
const dateFormat = new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" });

export default function Index() {
  const { status, error, expenses, signIn, reload } = useExpenses();
  const sortedExpenses = [...expenses.filter(expense => !expense.archived)].sort(
    (a, b) => b.date.localeCompare(a.date) || Date.parse(b.created_at) - Date.parse(a.created_at)
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

  return (
    <>
      <Stack.Screen options={{ headerTitle: "Monies" }} />
      <SafeAreaView edges={["bottom"]} style={{ flex: 1 }}>
        <Host style={{ flex: 1 }}>
          <Box modifiers={[fillMaxSize()]}>
            {status !== "ready" ? (
              <Box modifiers={[fillMaxSize(), padding(24, 0, 24, 0)]} contentAlignment="center">
                <Column verticalArrangement={{ spacedBy: 16 }} horizontalAlignment="center">
                  {status === "checking" || status === "loading" ? <CircularProgressIndicator /> : null}
                  {status === "signedOut" ? (
                    <>
                      <Text>Sign in to load your ledger from Google Sheets.</Text>
                      <Button onClick={signIn}><Text>Sign in with Google</Text></Button>
                    </>
                  ) : null}
                  {status === "error" ? (
                    <Button onClick={reload}><Text>Try again</Text></Button>
                  ) : null}
                  {error ? <Text color="#b00020">{error}</Text> : null}
                </Column>
              </Box>
            ) : groups.length === 0 ? (
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
                        {expense.description ? (
                          <ListItem.SupportingContent><Text style={{ fontSize: 12, fontWeight: "300" }}>{expense.description}</Text></ListItem.SupportingContent>
                        ) : null}
                        <ListItem.TrailingContent><Text style={{ fontSize: 20 }}>PKR {amountFormat.format(expense.amount)}</Text></ListItem.TrailingContent>
                      </ListItem>
                    </Card>
                  )),
                ])}
              </LazyColumn>
            )}
            {status === "ready" ? (
              <FloatingActionButton modifiers={[align("bottomEnd"), offset(-16, -16)]} onClick={() => router.push("/add-expense")}>
                <FloatingActionButton.Icon><Text style={{ fontSize: 28 }}>+</Text></FloatingActionButton.Icon>
              </FloatingActionButton>
            ) : null}
          </Box>
        </Host>
      </SafeAreaView>
    </>
  );
}
