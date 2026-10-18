# UI documentation

A working home for frontend decisions. Keep screen-specific details in `screens/` and add shared-component notes only when we have reusable components to document.

## Screens

- [Expenses](screens/expenses.md)

## Working approach

- Design and build one small screen or interaction at a time.
- Start with what the screen needs to help the user do, then sketch layout, states, and interactions before choosing components.
- I write most of the app logic myself. Claude can help design the UI, write or explain Expo UI components when asked, and review my work with reasons for suggested changes.
- Try each screen on a device and check empty, loading, error, and populated states where relevant before moving on.
- Keep data integration separate from the first UI pass so the interface can be explored with sample data.

## Current state

- Expo Router provides navigation; the app currently has a single home screen.
- The home screen shows a refreshable sample list, not saved ledger entries.
- `@expo/ui` is installed and used for the sample list. We have not yet decided where native Expo UI components fit best versus regular React Native components.
- Google Sheets integration is experimental and not connected to the screen. The `useSheets` hook does not yet reflect the current spreadsheet schema and is not a source of truth for UI or data modeling; it will be updated later.
- The current header and splash screen use different colors; no visual palette has been chosen.

## Spreadsheet data model

The actual Google Sheet is the source of truth for transaction and category fields:

- `transactions`: `id`, `amount`, `description`, `category_id`, `category` (formula), `date`, `created_at`, `archived` (soft deletion).
- `categories`: `id`, `title`, `description`.

`date` is distinct from `created_at`. Screen-specific display and ordering decisions live in the linked screen notes.

## App-wide decisions to make later

- iOS behavior and styling after the Android-first pass.
- Visual direction: typography, colors, spacing, and use of platform-native styling.
- Navigation beyond the first screen.

## Screen notes template

For each screen, capture only what helps with the next implementation step:

- **Purpose:** What the user comes here to do.
- **Content and actions:** What must be visible or tappable.
- **States:** Empty, loading, error, and populated, as applicable.
- **Layout sketch:** A quick description or rough drawing.
- **Component choices:** Expo UI or React Native, and why.
- **Device check:** What worked, what felt awkward, and what to change.
