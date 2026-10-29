# Expenses screen

## Purpose

Make expenses easy to scan on Android first. Begin with sample data before connecting Google Sheets.

## Decided

- Each row shows amount, category, and description. Show `date` once as the group heading, not in every row.
- Group rows by `date`, newest group first; order rows within each group by `created_at`, newest first.
- Use a circular floating `+` button at the bottom-right to start adding an expense. Keep it available when the list is empty.
- The empty state says “No expenses yet.”
- Display amounts in PKR and dates as `DD MMM YYYY` (for example, `18 Oct 2026`).
- The source data comes from the real `transactions` sheet described in the [UI overview](../README.md), not the current `useSheets` hook.

## First implementation

- Sample expenses and new session-only entries exercise the date grouping and `created_at` ordering before Sheets integration.
- Android uses `@expo/ui/jetpack-compose`: `Host` contains the native UI, `LazyColumn` scrolls, `Card` rounds and spaces rows, and `ListItem` shows expense details.
- The floating `+` button opens Add expense.

## Device check

The populated list and rounded cards rendered on Android. The floating button clears the system navigation bar. Verify the empty state on-device before connecting data.
