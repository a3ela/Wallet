import { Ionicons } from "@expo/vector-icons";
import { useAuth, useUser } from "@clerk/expo";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import type { ThemePreference } from "@/theme/theme-constants";
import { useThemePreference } from "@/theme/theme-provider";

const THEME_OPTIONS: {
  value: ThemePreference;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  { value: "system", label: "System", icon: "desktop-outline" },
  { value: "light", label: "Light", icon: "sunny-outline" },
  { value: "dark", label: "Dark", icon: "moon-outline" },
];

export default function ProfileScreen() {
  const { user } = useUser();
  const { signOut } = useAuth();
  const { preference, setPreference } = useThemePreference();

  const fullName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    "Wallet User";
  const email =
    user?.primaryEmailAddress?.emailAddress ??
    user?.emailAddresses?.[0]?.emailAddress ??
    "";

  const onLogOutPress = () => {
    Alert.alert("Log out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log out",
        style: "destructive",
        onPress: () => {
          void signOut();
        },
      },
    ]);
  };

  return (
    <ScrollView
      className="flex-1 bg-(--background)"
      showsVerticalScrollIndicator={false}
      contentContainerClassName="flex-grow px-6 py-12"
    >
      {/* User header */}
      <View className="items-center mb-10">
        {user?.imageUrl ? (
          <Image
            source={{ uri: user.imageUrl }}
            className="w-24 h-24 rounded-full border-(--border) border-2 bg-(--card)"
          />
        ) : (
          <View className="w-24 h-24 rounded-full bg-(--primary-muted) items-center justify-center border-(--border) border-2">
            <Ionicons name="person" size={44} color="#2ECC71" />
          </View>
        )}

        <Text className="mt-4 text-[22px] font-inter-bold text-(--foreground)">
          {fullName}
        </Text>
        {email ? (
          <Text className="mt-1 text-[14px] font-inter-regular text-(--muted-foreground)">
            {email}
          </Text>
        ) : null}
      </View>

      {/* Appearance */}
      <View className="bg-(--card) rounded-2xl p-5 border-(--border) border">
        <Text className="text-[13px] font-inter-semibold uppercase tracking-wide text-(--muted-foreground)">
          Appearance
        </Text>

        <View className="flex-row gap-2 mt-4">
          {THEME_OPTIONS.map((option) => {
            const isActive = preference === option.value;
            return (
              <Pressable
                key={option.value}
                onPress={() => setPreference(option.value)}
                className={`flex-1 h-12 rounded-xl flex-row items-center justify-center gap-1.5 ${
                  isActive ? "bg-(--primary)" : "bg-(--muted)"
                }`}
              >
                <Ionicons
                  name={option.icon}
                  size={16}
                  color={isActive ? "#FFFFFF" : "#8A8D96"}
                />
                <Text
                  className={`text-[13px] font-inter-semibold ${
                    isActive
                      ? "text-white"
                      : "text-(--muted-foreground)"
                  }`}
                >
                  {option.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Log out */}
      <View className="mt-8">
        <Pressable
          onPress={onLogOutPress}
          className="h-14 rounded-xl bg-(--destructive) flex-row items-center justify-center active:opacity-80"
        >
          <Ionicons name="log-out-outline" size={18} color="#FFFFFF" />
          <Text className="ml-2 text-base font-inter-semibold text-white">
            Log out
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}