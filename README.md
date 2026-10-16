# Monies

A personal ledger app built with Expo and React Native. This is a learning project for building a mobile frontend with Google Sheets as the planned data store.

## Current state

The app currently displays a refreshable sample list. An experimental Google Sheets hook exists, but the screen does not use it yet; you cannot record or view expenses in the app.

## Run locally

1. Install dependencies:
   ```bash
    npm install
   ```
2. Start Expo with the development build:
   ```bash
    npx expo start --dev-client
   ```

The available scripts also include `npm run android`, `npm run ios`, `npm run web`, and `npm run lint`.

## Development build with EAS

The development build includes native modules and runs the app through a development client rather than Expo Go. These packages are already in `package.json` and installed by `npm install`. To add or update them for the current Expo SDK, use:

```bash
npx expo install expo-dev-client expo-auth-session expo-web-browser expo-crypto expo-secure-store
```

`expo-dev-client` provides the development client. The other packages support Google sign-in and secure token storage in `src/hooks/useSheets.ts`.

[EAS Build](https://docs.expo.dev/build/introduction/) builds the native development client in the cloud. This repo already has an EAS project ID in `app.json` and a `development` profile in `eas.json` (`developmentClient: true`, `distribution: internal`), so you do not need to run `eas build:configure`.

1. Install the EAS CLI globally (once):
   ```bash
   npm install --global eas-cli
   ```
2. Sign in to your Expo account:
   ```bash
   eas login
   ```
3. Build for the device you will use (choose one):
   ```bash
   eas build --profile development --platform android
   eas build --profile development --platform ios
   ```

    EAS may prompt for signing credentials. Building for a physical iOS device requires Apple Developer credentials. Install the resulting build using the link or QR code from EAS.
4. Start Metro for the installed development build:
   ```bash
    npx expo start --dev-client
   ```

Open the installed app and connect it to Metro. JavaScript changes reload without rebuilding; rebuild after adding or changing native dependencies or configuration. For a local native build instead of EAS, use `npm run android` or `npm run ios` with the corresponding native tooling installed.

## Google Sheets integration (in progress)

`src/hooks/useSheets.ts` contains sign-in, add-expense, and list-expenses functions. The hook expects these environment variables when you work on the integration:

- `EXPO_PUBLIC_SHEET_ID`: spreadsheet ID
- `EXPO_PUBLIC_GOOGLE_ANDROID_ID`: Android OAuth client ID
- `EXPO_PUBLIC_GOOGLE_IOS_ID`: iOS OAuth client ID
- `EXPO_PUBLIC_GOOGLE_WEB_ID`: web OAuth client ID

It reads and appends rows in an `Expenses` sheet, with columns for timestamp, amount, category, and note (`A:D`). These functions are not connected to the current screen.
