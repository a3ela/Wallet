import { ALL_CURRENCIES } from "@/components/CurrencyPicker";
import {
  onboardingFormValues,
  onboardingSchema,
} from "@/lib/schemas/onboarding.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { isLoading } from "expo-font";
import { router } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OnboardingScreen() {
  const {
    control,
    handleSubmit,
    formState: { errors: formErrors },
  } = useForm<onboardingFormValues>({
    resolver: zodResolver(onboardingSchema),
    mode: "onBlur",
    defaultValues: {
      startingBalance: "",
    },
  });

  const [pickerVisible, setPickerVisible] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCurrency, setSelectedCurrency] = useState(
    ALL_CURRENCIES.find((c) => c.code === "BIRR") ?? ALL_CURRENCIES[0],
  );

  const handleSave = async ({ startingBalance }: onboardingFormValues) => {};

  return (
    <SafeAreaView className="flex-1 bg-brand-body" edges={["top"]}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View className="w-full">
          <View className="items-center mb-8">
            <Image
              source={require("../../../assets/images/icon.png")}
              resizeMode="contain"
              className="w-24 h-24"
            />
          </View>

          <View className="items-center mb-8">
            <Text className="text-3xl font-bold text-brand-primary">
              Let's get started
            </Text>

            <Text className="text-base text-brand-text-muted mt-2 text-center">
              Create an account to start managing your finances and track your
              spending.
            </Text>
          </View>

          <View className="gap-4">
            <View>
              <Text className="text-sm font-medium text-(--foreground) mb-2">
                Starting Balance
              </Text>

              <Controller
                control={control}
                name="startingBalance"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className="flex-1 py-3.5 text-sm text-brand-bg"
                    placeholder="eg. 1000"
                    placeholderTextColor="#94A3B8"
                    returnKeyType="done"
                    onChangeText={onChange}
                    value={value}
                    keyboardType="numeric"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                )}
              />

              {formErrors.startingBalance && (
                <Text className="text-xs text-red-500 mt-1">
                  {formErrors.startingBalance.message}
                </Text>
              )}
            </View>

            <View>
              <Text className="text-sm font-medium text-(--foreground) mb-2">
                Password
              </Text>

              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    placeholder="Your password"
                    placeholderTextColor="#94A3B8"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    onFocus={() =>
                      scrollToOffset(Platform.OS === "android" ? 220 : 180)
                    }
                    value={value}
                    secureTextEntry
                    autoCapitalize="none"
                    className={`h-14 rounded-xl border bg-(--input) px-4 text-base text-(--foreground) ${
                      formErrors.password
                        ? "border-red-500"
                        : "border-brand-text-muted/30"
                    }`}
                  />
                )}
              />

              {formErrors.password && (
                <Text className="text-xs text-red-500 mt-1">
                  {formErrors.password.message}
                </Text>
              )}
            </View>

            {/* Sign in button */}
            <Pressable
              onPress={handleSubmit(onSignInPress)}
              className="h-14 items-center justify-center rounded-xl bg-brand-primary mt-2 active:opacity-80"
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text className="text-base font-semibold text-white">
                  Sign in
                </Text>
              )}
            </Pressable>
          </View>

          {/* Sign up */}
          <View className="flex-row justify-center mt-8">
            <Text className="text-brand-text-muted">
              Don't have an account?{" "}
            </Text>

            <Pressable onPress={() => router.push("/(auth)/sign-up")}>
              <Text className="font-semibold text-brand-primary">Sign up</Text>
            </Pressable>
          </View>

          {/* Bottom spacer so inputs can scroll well above the keyboard */}
          <View style={{ height: isKeyboardVisible ? 220 : 20 }} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
