import { Stack } from "expo-router";

export default function RootLayout() {
  return <Stack
    screenOptions={{
      headerStyle: { backgroundColor: "#6200EE" }, // Purple header background
      headerTintColor: "#fff",                     // White text/back arrow
      headerTitleStyle: { fontWeight: "bold" },
    }}
  />;
}
