# Expenses screen

## Purpose

Make expenses easy to scan on Android first.

## Decided

- Each row shows amount, category, and description. Show `date` once as the group heading, not in every row.
- Group rows by `date`, newest group first; order rows within each group by `created_at`, newest first.
- Use a circular floating `+` button at the bottom-right to start adding an expense. Keep it available when the list is empty.
- The empty state says “No expenses yet.”
- Display amounts in PKR and dates as `DD MMM YYYY` (for example, `18 Oct 2026`).
- The source data comes from the `transactions` sheet described in the [UI overview](../README.md). Archived rows are hidden.

## First implementation

- Before data loads, the screen shows a spinner, a Google sign-in prompt, or an error with Try again. The `+` button appears only once data is ready.
- Android uses `@expo/ui/jetpack-compose`: `Host` contains the native UI, `LazyColumn` scrolls, `Card` rounds and spaces rows, and `ListItem` shows expense details.
- The floating `+` button opens Add expense.

## Device check

The populated list and rounded cards rendered on Android. The floating button clears the system navigation bar. The Google sign-in and Sheets loading states have not been tested on a device yet.
