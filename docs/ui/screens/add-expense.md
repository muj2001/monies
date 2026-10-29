# Add expense screen

## Purpose

Create a transaction and show it in the Expenses list. This first pass saves only in app memory; entries added during a session disappear when the app restarts.

## Fields and actions

- Amount in PKR, greater than zero with up to two decimal places. The field accepts digits and at most one period; it rejects further input past two decimal places.
- Category selected from temporary sample categories; save its `category_id` and display title.
- Optional description.
- Expense date defaults to today and opens an Android date picker. Store it separately from `created_at`.
- Save validates amount and category, adds the expense to the session list, then returns to Expenses.

## Component choices

- React Native `TextInput` and `Pressable` handle controlled form fields and actions.
- Expo UI `DatePickerDialog` provides the Android date picker.

## Device check

Tested on Android: empty amount shows an error, a third decimal digit is rejected while typing, date selection updates the form, and Save returns to the correctly grouped expense list. Sample categories remain temporary.
