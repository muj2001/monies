# Frontend and design notes

A working note for the mobile UI. Record decisions as we make them; keep untested ideas under open questions rather than treating them as requirements.

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

## Spreadsheet data model

The actual Google Sheet is the source of truth for transaction and category fields:

- `transactions`: `id`, `amount`, `description`, `category_id`, `category` (formula), `date`, `created_at`, `archived` (soft deletion).
- `categories`: `id`, `title`, `description`.

For display, `date` is distinct from `created_at`. The expense row shows the transaction's `category` value and `description`.
- The current header and splash screen use different colors; no visual palette has been chosen.

## First design slice: expenses screen

**Goal:** Make expenses easy to scan on Android first. Begin with sample data before connecting Google Sheets.

Decided:

- Each row shows amount, category, description, and date.
- Group rows by date; order expenses by `created_at`.

To decide together before implementing:

- Should date groups be newest first or oldest first? Within each date group, should `created_at` order be newest first or oldest first?
- What should an empty ledger look like, and what is the primary action from that state?
- Where should the action to add an expense live?

## Decisions to make later

- iOS behavior and styling after the Android-first pass.
- Visual direction: typography, colors, spacing, and use of platform-native styling.
- Navigation beyond the first screen.
- Amount and date formatting, including currency.

## Screen notes template

For each screen, capture only what helps with the next implementation step:

- **Purpose:** What the user comes here to do.
- **Content and actions:** What must be visible or tappable.
- **States:** Empty, loading, error, and populated, as applicable.
- **Layout sketch:** A quick description or rough drawing.
- **Component choices:** Expo UI or React Native, and why.
- **Device check:** What worked, what felt awkward, and what to change.
