import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useTheme } from "@/theme/theme-provider";

export default function TabLayout() {
  const theme = useTheme();
  const isDark = theme === "dark";

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#2ECC71",
        tabBarInactiveTintColor: "#8A8D96",
        tabBarStyle: [
          styles.tabBar,
          {
            backgroundColor: isDark ? "#0B0E14" : "#FFFFFF",
            borderTopColor: isDark ? "#232838" : "rgba(0, 0, 0, 0.06)",
          },
        ],
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="transactions"
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "swap-horizontal" : "swap-horizontal-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="add"
        options={{
          tabBarButton: ({
            onPress,
            accessible,
            accessibilityLabel,
            testID,
          }) => (
            <TouchableOpacity
              onPress={onPress}
              accessible={accessible}
              accessibilityLabel={accessibilityLabel}
              testID={testID}
              style={styles.centerButtonContainer}
              activeOpacity={0.8}
            >
              <View style={styles.centerButton}>
                <Ionicons name="add" size={32} color="#FFFFFF" />
              </View>
            </TouchableOpacity>
          ),
        }}
      />
      <Tabs.Screen
        name="assistant"
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "sparkles" : "sparkles-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 65,
    borderTopWidth: 1,
    borderTopColor: "rgba(0, 0, 0, 0.06)",
    backgroundColor: "#FFFFFF",
  },
  centerButtonContainer: {
    top: -20,
    justifyContent: "center",
    alignItems: "center",
  },
  centerButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#2ECC71",
    justifyContent: "center",
    alignItems: "center",
  },
});
