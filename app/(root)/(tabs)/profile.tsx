import { useAuth } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

type IconName = keyof typeof Ionicons.glyphMap;

type MenuRow = {
  icon: IconName;
  label: string;
  right?: string;
};

type MenuSection = {
  heading: string;
  rows: MenuRow[];
};

const MENU_SECTIONS: MenuSection[] = [
  {
    heading: "Account",
    rows: [
      {
        icon: "card-outline",
        label: "Payment Methods",
        right: "Visa •••• 4242",
      },
      { icon: "notifications-outline", label: "Notifications", right: "On" },
    ],
  },
  {
    heading: "Preferences",
    rows: [
      { icon: "language-outline", label: "Language", right: "English" },
      { icon: "moon-outline", label: "Appearance", right: "Light" },
    ],
  },
  {
    heading: "About",
    rows: [
      { icon: "shield-checkmark-outline", label: "Security & Privacy" },
      { icon: "information-circle-outline", label: "Version", right: "1.0.0" },
    ],
  },
];

const ProfileScreen = () => {
  const { signOut } = useAuth();
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const onLogout = async () => {
    if (isSigningOut) return;
    setIsSigningOut(true);
    try {
      await signOut();
      router.replace("/sign-in");
    } catch (err) {
      console.error("Error signing out:", err);
      setIsSigningOut(false);
    }
  };

  return (
    <View className="flex-1 bg-brand-body">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View className="px-6 pt-8">
          <Text className="text-3xl font-bold text-[#1A1D26] mb-6">
            Profile
          </Text>

          <View className="items-center mb-8">
            <View className="w-24 h-24 rounded-full bg-primary items-center justify-center mb-3">
              <Ionicons name="person" size={44} color="white" />
            </View>
            <Text className="text-xl font-bold text-[#1A1D26]">Jane Doe</Text>
            <Text className="text-sm text-[#8A8D96]">jane.doe@example.com</Text>
          </View>

          {MENU_SECTIONS.map((section) => (
            <View key={section.heading} className="mb-6">
              <Text className="text-sm font-semibold text-[#8A8D96] uppercase tracking-wide mb-2">
                {section.heading}
              </Text>
              <View className="bg-white rounded-2xl border border-[#D8D9DE] divide-y divide-[#F1F2F5]">
                {section.rows.map((row) => (
                  <View
                    key={row.label}
                    className="flex-row items-center justify-between px-4 py-4"
                  >
                    <View className="flex-row items-center">
                      <Ionicons name={row.icon} size={20} color="#1A1D26" />
                      <Text className="ml-3 text-base text-[#1A1D26]">
                        {row.label}
                      </Text>
                    </View>
                    <View className="flex-row items-center">
                      {row.right && (
                        <Text className="text-sm text-[#8A8D96] mr-1">
                          {row.right}
                        </Text>
                      )}
                      <Ionicons
                        name="chevron-forward"
                        size={18}
                        color="#C5C7CE"
                      />
                    </View>
                  </View>
                ))}
              </View>
            </View>
          ))}

          <Pressable
            className="h-14 rounded-xl bg-red-500 items-center justify-center active:opacity-80"
            onPress={onLogout}
            disabled={isSigningOut}
          >
            {isSigningOut ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-semibold text-base">
                Log Out
              </Text>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;
