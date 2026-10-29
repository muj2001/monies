import { DatePickerDialog, Host } from "@expo/ui/jetpack-compose";
import { Stack, router } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { sampleCategories, useExpenses } from "../hooks/useExpenses";

const dateFormat = new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" });

function sheetDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function AddExpense() {
  const { addExpense } = useExpenses();
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [date, setDate] = useState(new Date());
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = () => {
    const enteredAmount = amount.trim();
    const numericAmount = Number(enteredAmount);
    if (!/^\d+(\.\d{1,2})?$/.test(enteredAmount) || !Number.isFinite(numericAmount) || numericAmount <= 0) {
      setError("Enter an amount greater than zero, with up to two decimal places.");
      return;
    }
    if (!categoryId) {
      setError("Choose a category.");
      return;
    }

    addExpense({
      amount: numericAmount,
      description: description.trim(),
      category_id: categoryId,
      date: sheetDate(date),
    });
    router.back();
  };

  return (
    <>
      <Stack.Screen options={{ title: "Add expense" }} />
      <SafeAreaView edges={["bottom"]} style={styles.screen}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Amount (PKR)</Text>
            <TextInput
              accessibilityLabel="Amount in PKR"
              keyboardType="decimal-pad"
              placeholder="0.00"
              value={amount}
              onChangeText={value => {
                if (/^\d*(\.\d{0,2})?$/.test(value)) {
                  setAmount(value);
                  setError(null);
                }
              }}
              style={styles.input}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Category</Text>
            <View style={styles.categories}>
              {sampleCategories.map(category => (
                <Pressable
                  key={category.id}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: categoryId === category.id }}
                  onPress={() => { setCategoryId(category.id); setError(null); }}
                  style={[styles.category, categoryId === category.id && styles.selectedCategory]}>
                  <Text style={[styles.categoryText, categoryId === category.id && styles.selectedCategoryText]}>
                    {category.title}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Description (optional)</Text>
            <TextInput
              accessibilityLabel="Description"
              placeholder="What was this for?"
              value={description}
              onChangeText={setDescription}
              style={styles.input}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Date</Text>
            <Pressable accessibilityRole="button" onPress={() => setDatePickerOpen(true)} style={styles.input}>
              <Text style={styles.dateText}>{dateFormat.format(date)}</Text>
            </Pressable>
          </View>

          {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}

          <Pressable accessibilityRole="button" onPress={save} style={({ pressed }) => [styles.save, pressed && styles.pressed]}>
            <Text style={styles.saveText}>Save expense</Text>
          </Pressable>
        </ScrollView>
        {datePickerOpen ? (
          <Host>
            <DatePickerDialog
              initialDate={date.toISOString()}
              onDateSelected={selected => { setDate(selected); setDatePickerOpen(false); }}
              onDismissRequest={() => setDatePickerOpen(false)}
            />
          </Host>
        ) : null}
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#f3f3f3" },
  content: { padding: 20, paddingBottom: 32, gap: 24 },
  fieldGroup: { gap: 10 },
  label: { fontSize: 16, fontWeight: "600", color: "#242424" },
  input: { backgroundColor: "#fff", borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 18, color: "#242424" },
  categories: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  category: { backgroundColor: "#fff", borderWidth: 1, borderColor: "#bbb", borderRadius: 24, paddingHorizontal: 16, paddingVertical: 10 },
  selectedCategory: { backgroundColor: "#eee5ff", borderColor: "#6200EE" },
  categoryText: { fontSize: 16, color: "#242424" },
  selectedCategoryText: { color: "#6200EE", fontWeight: "600" },
  dateText: { fontSize: 18, color: "#242424" },
  error: { color: "#b00020", fontSize: 14 },
  save: { backgroundColor: "#6200EE", borderRadius: 12, alignItems: "center", padding: 16, marginTop: 8 },
  pressed: { opacity: 0.8 },
  saveText: { color: "#fff", fontSize: 17, fontWeight: "600" },
});
