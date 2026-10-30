# Monies

A personal ledger app built with Expo and React Native. This is a learning project for building a mobile frontend with Google Sheets as the planned data store for now.

## Tech Stack

| Technology | Purpose | System role | Development status | Replaces |
| --- | --- | --- | --- | --- |
| React Native | Build the mobile interface | UI framework | In use | — |
| Expo | Develop and build the app | App platform and tooling | In use | — |
| Expo Router | Navigate between screens | Navigation | In use | — |
| TypeScript | Check types during development | Programming language | In use | — |
| Google Sheets | Store expense records | Data store | Integration in progress | — |

## Current state

The app signs in with Google, loads expenses and categories from Google Sheets, and appends new expenses to the sheet. Android is the only platform set up so far.

Frontend workflow, design questions, and screen notes live in [UI documentation](docs/ui/README.md).

## Run locally

1. Install dependencies:
   ```bash
     npm install
   ```
2. Start Expo with the development build:
   ```bash
     npx expo start --dev-client
   ```

The available scripts also include `npm run start`, `npm run android`, `npm run ios`, `npm run web`, and `npm run lint`.

## Development build with EAS

The development build includes native modules and runs the app through a development client rather than Expo Go. These packages are already in `package.json` and installed by `npm install`. To add or update them for the current Expo SDK, use:

```bash
npx expo install expo-dev-client @react-native-google-signin/google-signin expo-crypto
```

`expo-dev-client` provides the development client. `@react-native-google-signin/google-signin` handles Google sign-in and access tokens, and `expo-crypto` generates transaction IDs.

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

## Google Sheets integration

`src/lib/sheets.ts` signs in with Google, reads the `categories` and `transactions` tabs, and appends rows to `transactions`. It matches columns by the header row, so column order in the sheet does not matter. The data model is described in [UI documentation](docs/ui/README.md).

### Google Cloud setup (Android)

1. In a Google Cloud project, enable the **Google Sheets API**.
2. Configure the **OAuth consent screen** in Testing mode and add your Google account as a test user.
3. Create an **Android** OAuth client with package `com.mujnuu.ledger` and the SHA-1 of the signing key for the build you install. Get the debug key's SHA-1 with `cd android && ./gradlew signingReport`. EAS builds use a different key, so add that SHA-1 as a separate Android client.
4. Optionally create a **Web** OAuth client. Its ID is only needed for ID tokens.

### Environment variables

Put these in `.env.local`, which git ignores:

- `EXPO_PUBLIC_SHEET_ID`: spreadsheet ID from the sheet URL
- `EXPO_PUBLIC_GOOGLE_WEB_ID`: web OAuth client ID (optional)

### Rebuild after native changes

The sign-in library adds native code, so rebuild the development client after installing it or changing its config:

```bash
npx expo prebuild --clean
npx expo run:android
```

The `iosUrlScheme` in `app.json` is a placeholder; replace it with the reversed iOS client ID before building for iOS.
