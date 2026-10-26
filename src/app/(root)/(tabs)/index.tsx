import { Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <View className="flex-1 bg-(--background) items-center justify-center">
      <Text className="text-(--muted-foreground) font-inter-medium">
        Home Screen
      </Text>
    </View>
  );
}