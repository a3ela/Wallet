import {
  CodeFormSchema,
  codeSchema,
  signInFormValues,
  signInSchema,
} from "@/lib/schemas/auth.schema";
import { useSignIn } from "@clerk/expo";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Image,
  Keyboard,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const CODE_LENGTH = 6;

export default function SignIn() {
  const { signIn, errors, fetchStatus } = useSignIn();
  const router = useRouter();
  const isLoading = fetchStatus === "fetching";

  const [email, setEmail] = useState("");
  const inputRef = useRef<TextInput>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useEffect(() => {
    const showEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showSub = Keyboard.addListener(showEvent, () => {
      setIsKeyboardVisible(true);
    });
    const hideSub = Keyboard.addListener(hideEvent, () => {
      setIsKeyboardVisible(false);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const scrollToOffset = (y: number) => {
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({ y, animated: true });
    }, 120);
  };

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors: formErrors },
  } = useForm<signInFormValues>({
    resolver: zodResolver(signInSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {
    control: codeControl,
    handleSubmit: codeHandleSubmit,
    setError: setCodeError,
    formState: { errors: codeErrors },
  } = useForm<CodeFormSchema>({
    resolver: zodResolver(codeSchema),
    mode: "onBlur",
    defaultValues: {
      code: "",
    },
  });

  const finalizeSignIn = async () => {
    await signIn.finalize({
      navigate: ({ session, decorateUrl }) => {
        if (session?.currentTask) return;
        const url = decorateUrl("/");
        router.replace(url as any);
      },
    });
  };

  const onSignInPress = async (data: signInFormValues) => {
    setEmail(data.email);

    const { error } = await signIn.password({
      identifier: data.email,
      password: data.password,
    });

    if (error) {
      console.error(JSON.stringify(error, null, 2));
      const clerkError = (error as any)?.errors?.[0];
      const paramName = clerkError?.meta?.paramName;
      const message =
        clerkError?.longMessage || clerkError?.message || "Sign in failed";
      if (paramName === "password") {
        setError("password", { message });
      } else if (paramName === "identifier" || paramName === "email") {
        setError("email", { message });
      } else {
        setError("password", { message });
      }
      return;
    }

    if (signIn.status === "complete") {
      await finalizeSignIn();
      return;
    }

    // Password verified, but an additional factor (email code) is required.
    await signIn.emailCode.sendCode();
  };

  const onVerifyPress = async ({ code }: { code: string }) => {
    const { error } = await signIn.emailCode.verifyCode({ code });

    if (error) {
      console.error(JSON.stringify(error, null, 2));
      const clerkError = (error as any)?.errors?.[0];
      setCodeError("code", {
        message:
          clerkError?.longMessage ||
          clerkError?.message ||
          "Invalid verification code",
      });
      return;
    }

    if (signIn.status === "complete") {
      await finalizeSignIn();
    } else {
      console.error("SignIn status is not complete:", JSON.stringify(signIn, null, 2));
    }
  };

  const needsEmailCode =
    signIn.status === "needs_first_factor" &&
    signIn.supportedFirstFactors.some(
      (factor) => "strategy" in factor && factor.strategy === "email_code",
    );

  if (needsEmailCode) {
    return (
      <SafeAreaView className="flex-1 bg-(--background)">
        <ScrollView
          contentContainerClassName="flex-grow justify-center px-6 py-8"
          automaticallyAdjustKeyboardInsets={true}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
        >
          <View className="w-full">
            <View className="items-center mb-8">
              <Image
                source={require("../../../assets/images/icon.png")}
                resizeMode="contain"
                className="w-20 h-20 mb-4"
              />
              <Text className="text-2xl font-bold text-(--foreground) mb-1">
                Verify Email
              </Text>
              <Text className="text-sm text-brand-text-muted/80 text-center px-4">
                We sent a 6-digit verification code to{" "}
                <Text className="font-semibold text-(--foreground)">
                  {email || "your email"}
                </Text>
              </Text>
            </View>

            <View className="w-full">
              <Controller
                control={codeControl}
                name="code"
                render={({ field: { onChange, onBlur, value = "" } }) => (
                  <View className="relative w-full items-center">
                    <TouchableOpacity
                      activeOpacity={1}
                      onPress={() => inputRef.current?.focus()}
                      className="flex-row justify-between w-full"
                    >
                      {Array.from({ length: CODE_LENGTH }).map((_, index) => {
                        const char = value[index];
                        const isFocused = value.length === index;
                        const hasError = !!codeErrors.code;

                        let borderColor = "border-brand-text-muted/20";
                        if (hasError) {
                          borderColor = "border-red-500";
                        } else if (isFocused) {
                          borderColor = "border-brand-primary border-2";
                        } else if (char) {
                          borderColor = "border-brand-text/60";
                        }

                        return (
                          <View
                            key={index}
                            className={`w-12 h-14 rounded-xl border bg-(--input) justify-center items-center shadow-sm ${borderColor}`}
                          >
                            <Text className="text-xl font-bold text-(--foreground)">
                              {char || ""}
                            </Text>
                          </View>
                        );
                      })}
                    </TouchableOpacity>
                    <TextInput
                      ref={inputRef}
                      value={value}
                      onChangeText={(text) =>
                        onChange(
                          text.replace(/[^0-9]/g, "").slice(0, CODE_LENGTH),
                        )
                      }
                      onBlur={onBlur}
                      keyboardType="number-pad"
                      maxLength={CODE_LENGTH}
                      textContentType="oneTimeCode"
                      autoFocus
                      className="absolute opacity-0 w-full h-full"
                    />
                  </View>
                )}
              />

              {codeErrors.code && (
                <Text className="text-xs text-red-500 mt-2 text-center font-medium">
                  {codeErrors.code.message}
                </Text>
              )}

              <TouchableOpacity
                onPress={codeHandleSubmit(onVerifyPress)}
                disabled={isLoading}
                className="mt-8 bg-brand-primary h-14 rounded-xl justify-center items-center shadow-md active:opacity-80"
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text className="text-white text-base font-semibold">
                    Verify Code
                  </Text>
                )}
              </TouchableOpacity>

              <View className="flex-row justify-center items-center mt-6">
                <Text className="text-sm text-brand-text-muted">
                  Didn't receive code?{" "}
                </Text>
                <Pressable onPress={() => signIn.emailCode.sendCode()}>
                  <Text className="text-sm font-semibold text-brand-primary">
                    Resend
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-(--background)">
      <ScrollView
        ref={scrollViewRef}
        contentContainerClassName="flex-grow justify-center px-6 py-8"
        automaticallyAdjustKeyboardInsets={true}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
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
              Welcome back
            </Text>

            <Text className="text-base text-brand-text-muted mt-2 text-center">
              Sign in to track your money
            </Text>
          </View>

          <View className="gap-4">
            <View>
              <Text className="text-sm font-medium text-(--foreground) mb-2">
                Email
              </Text>

              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    placeholder="you@example.com"
                    placeholderTextColor="#94A3B8"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    onFocus={() => scrollToOffset(60)}
                    value={value}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    className={`h-14 rounded-xl border bg-(--input) px-4 text-base text-(--foreground) ${
                      formErrors.email
                        ? "border-red-500"
                        : "border-brand-text-muted/30"
                    }`}
                  />
                )}
              />

              {formErrors.email && (
                <Text className="text-xs text-red-500 mt-1">
                  {formErrors.email.message}
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
      </ScrollView>
    </SafeAreaView>
  );
}