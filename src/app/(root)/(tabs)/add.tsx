import { Text, View } from "react-native";

export default function AddScreen() {
  return (
    <View className="flex-1 bg-(--background) items-center justify-center">
      <Text className="text-(--muted-foreground) font-inter-medium">
        Add Screen
      </Text>
    </View>
  );
}