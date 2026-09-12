import { ALL_CURRENCIES, CurrencyPicker } from "@/components/CurrencyPicker";
import { useSupabase } from "@/hooks/useSuperbase";
import {
  onboardingFormValues,
  onboardingSchema,
} from "@/lib/schemas/onboarding";
import { useUserStore } from "@/store/userStore";
import { useUser } from "@clerk/expo";
import { Feather } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function OnboardingScreen() {
  const { user } = useUser();
  const authSupabase = useSupabase();
  const setCurrency = useUserStore((s) => s.setCurrency);
  const setNeedsOnboarding = useUserStore((s) => s.setNeedsOnboarding);

  const {
    control,
    handleSubmit,
    formState: { errors: formErrors },
  } = useForm<onboardingFormValues>({
    resolver: zodResolver(onboardingSchema),
    mode: "onBlur",
    defaultValues: { startingBalance: "" },
  });

  const [selectedCurrency, setSelectedCurrency] = useState(
    ALL_CURRENCIES.find((c) => c.code === "INR") ?? ALL_CURRENCIES[0],
  );
  const [pickerOpen, setPickerOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async ({ startingBalance }: onboardingFormValues) => {
    const parsed = parseFloat(startingBalance.replace(/,/g, ""));
    setSaving(true);
    setError("");

    const { error: updateError } = await authSupabase
      .from("users")
      .update({
        currency: selectedCurrency.code,
      })
      .eq("clerk_id", user!.id);

    if (updateError) {
      setSaving(false);
      setError("Something went wrong. Please try again.");
      return;
    }

    const { data: defaultAccount, error: accountFetchError } =
      await authSupabase
        .from("accounts")
        .select("id, balance")
        .eq("user_id", user!.id)
        .eq("is_default", true)
        .single();

    if (accountFetchError || !defaultAccount) {
      setSaving(false);
      setError("Something went wrong. Please try again.");
      return;
    }

    const { error: txError } = await authSupabase.from("transactions").insert({
      user_id: user!.id,
      account_id: defaultAccount.id,
      type: "INCOME",
      amount: parsed,
      category: "other_income",
      description: "Starting balance",
      date: new Date().toISOString(),
      input_method: "MANUAL",
    });

    if (txError) {
      setSaving(false);
      setError("Something went wrong. Please try again.");
      return;
    }

    const { error: balanceError } = await authSupabase
      .from("accounts")
      .update({ balance: defaultAccount.balance + parsed })
      .eq("id", defaultAccount.id);

    setSaving(false);

    if (balanceError) {
      setError("Something went wrong. Please try again.");
      return;
    }

    setCurrency(selectedCurrency.code);
    setNeedsOnboarding(false);
    router.replace("/(root)/(tabs)");
  };

  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 bg-brand-body"
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: 40,
          }}
        >
          <View className="flex-1 justify-center px-6">
            <View className="items-center mb-8">
              <Image
                source={require("@/assets/images/logo.png")}
                resizeMode="contain"
                style={{
                  width: 150,
                  height: 100,
                }}
              />
              <Text className="text-3xl font-bold text-center mt-4">
                Let&apos;s get started
              </Text>
              <Text className="text-brand-text-muted text-center text-base mt-2">
                Set up your account to start using the app
              </Text>
            </View>

            <View className="gap-5">
              <View>
                <Text className="text-sm font-semibold text-[#1A1D26] mb-2">
                  Starting Balance
                </Text>
                <View className="h-14 flex-row items-center px-4 border border-[#D8D9DE] rounded-xl bg-white">
                  <Text className="text-[#1A1D26] mr-2">
                    {selectedCurrency.symbol}
                  </Text>
                  <Controller
                    control={control}
                    name="startingBalance"
                    render={({ field: { value, onChange, onBlur } }) => (
                      <TextInput
                        value={value}
                        onChangeText={(nextValue) => {
                          setError("");
                          onChange(nextValue);
                        }}
                        onBlur={onBlur}
                        placeholder="e.g. 50000"
                        placeholderTextColor="#8A8D96"
                        keyboardType="numeric"
                        returnKeyType="done"
                        className="flex-1 text-[#1A1D26]"
                      />
                    )}
                  />
                </View>
                {formErrors.startingBalance && (
                  <Text className="text-xs text-red-500 mt-1">
                    {formErrors.startingBalance.message}
                  </Text>
                )}
              </View>

              <View>
                <Text className="text-sm font-semibold text-[#1A1D26] mb-2">
                  Currency
                </Text>
                <TouchableOpacity
                  onPress={() => setPickerOpen(true)}
                  className="h-14 flex-row items-center justify-between px-4 border border-[#D8D9DE] rounded-xl bg-white"
                >
                  <Text className="text-[#1A1D26]">
                    {selectedCurrency.symbol} {selectedCurrency.code} -{" "}
                    {selectedCurrency.name}
                  </Text>
                  <Feather name="chevron-down" size={16} color="#8A8D96" />
                </TouchableOpacity>
              </View>

              {error ? (
                <Text className="text-xs text-red-500 text-center">
                  {error}
                </Text>
              ) : null}

              <TouchableOpacity
                onPress={handleSubmit(handleSave)}
                disabled={saving}
                className="h-14 rounded-xl bg-primary items-center justify-center mt-2 active:opacity-80"
              >
                <Text className="text-white text-base font-semibold">
                  {saving ? "Saving..." : "Get Started"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <CurrencyPicker
        visible={pickerOpen}
        selectedCode={selectedCurrency.code}
        onSelect={(currency) => {
          setSelectedCurrency(currency);
          setPickerOpen(false);
        }}
        onClose={() => setPickerOpen(false)}
      />
    </>
  );
}
