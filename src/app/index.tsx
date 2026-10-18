import { Host, List, ListItem } from "@expo/ui";
import { Stack } from "expo-router";
import { useState } from "react";
import { Text } from "react-native";

function ListRefreshExample() {
  const [items, setItems] = useState([1, 2, 3]);

  const handleRefresh = async () => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    setItems(prev => [Math.max(...prev) + 1, ...prev]);
  }

  return (
    <Host style={{flex: 1, backgroundColor: "white"}}>
      <List onRefresh={handleRefresh}>
        {items.map(id => (
          <ListItem key={id}>
            <Text>{`Expense ${id}`}</Text>
          </ListItem>
        ))}
      </List>
    </Host>
  )
}

export default function Index() {
  return (
    <>
      <Stack.Screen options={{ headerTitle: "Monies" }} />
      <ListRefreshExample />
    </>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//   },
// });
