import {
  CodeFormSchema,
  codeSchema,
  signUpFormValues,
  signUpSchema,
} from "@/lib/schemas/auth.schema";
import { useAuth, useSignUp } from "@clerk/expo";
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

export default function SignUp() {
  const { signUp, errors, fetchStatus } = useSignUp();
  const { isSignedIn } = useAuth();
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
  } = useForm<signUpFormValues>({
    resolver: zodResolver(signUpSchema),
    mode: "onBlur",
    defaultValues: {
      firstName: "",
      lastName: "",
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

  const onSignUpPress = async (data: signUpFormValues) => {
    setEmail(data.email);

    const { error } = await signUp.password({
      emailAddress: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
    });

    if (error) {
      console.error(JSON.stringify(error, null, 2));
      const clerkError = (error as any)?.errors?.[0];
      const paramName = clerkError?.meta?.paramName;
      const message =
        clerkError?.longMessage || clerkError?.message || "Sign up failed";
      if (paramName === "password") {
        setError("password", { message });
      } else if (paramName === "email_address" || paramName === "email") {
        setError("email", { message });
      } else if (paramName === "first_name") {
        setError("firstName", { message });
      } else if (paramName === "last_name") {
        setError("lastName", { message });
      } else {
        setError("password", { message });
      }
      return;
    }

    await signUp.verifications.sendEmailCode();
  };

  const onVerifyPress = async ({ code }: { code: string }) => {
    try {
      const { error } = await signUp.verifications.verifyEmailCode({ code });

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

      if (signUp.status === "complete") {
        await signUp.finalize({
          navigate: ({ session, decorateUrl }) => {
            if (session?.currentTask) return;
            const url = decorateUrl("/");
            router.replace(url as any);
          },
        });
      } else {
        console.error(
          "SignUp status is not complete:",
          JSON.stringify(signUp, null, 2),
        );
      }
    } catch (err: any) {
      const clerkError = err?.errors?.[0];
      setCodeError("code", {
        message:
          clerkError?.longMessage ||
          clerkError?.message ||
          "Verification failed",
      });
    }
  };

  if (
    signUp.status === "missing_requirements" &&
    signUp.unverifiedFields.includes("email_address") &&
    signUp.missingFields.length === 0
  ) {
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
                  {signUp.emailAddress || email || "your email"}
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
                            className={`w-12 h-14 rounded-xl border bg-(--input) justify-center items-center ${borderColor}`}
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
                      autoComplete="sms-otp"
                      autoFocus
                      caretHidden
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        opacity: 0,
                      }}
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
                <Pressable onPress={() => signUp.verifications.sendEmailCode()}>
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
              Create an account
            </Text>

            <Text className="text-base text-brand-text-muted mt-2 text-center">
              Track your money, powered by AI
            </Text>
          </View>

          <View className="gap-4">
            <View className="flex-row gap-3">
              <View className="flex-1">
                <Text className="text-sm font-medium text-(--foreground) mb-2">
                  First Name
                </Text>

                <Controller
                  control={control}
                  name="firstName"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      placeholder="John"
                      placeholderTextColor="#94A3B8"
                      onChangeText={onChange}
                      onBlur={onBlur}
                      onFocus={() => scrollToOffset(40)}
                      value={value}
                      autoCapitalize="words"
                      className={`h-14 rounded-xl border bg-(--input) px-4 text-base text-(--foreground) ${
                        formErrors.firstName
                          ? "border-red-500"
                          : "border-brand-text-muted/30"
                      }`}
                    />
                  )}
                />

                {formErrors.firstName && (
                  <Text className="text-xs text-red-500 mt-1">
                    {formErrors.firstName.message}
                  </Text>
                )}
              </View>

              <View className="flex-1">
                <Text className="text-sm font-medium text-(--foreground) mb-2">
                  Last Name
                </Text>

                <Controller
                  control={control}
                  name="lastName"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      placeholder="Doe"
                      placeholderTextColor="#94A3B8"
                      onChangeText={onChange}
                      onBlur={onBlur}
                      onFocus={() => scrollToOffset(40)}
                      value={value}
                      autoCapitalize="words"
                      className={`h-14 rounded-xl border bg-(--input) px-4 text-base text-(--foreground) ${
                        formErrors.lastName
                          ? "border-red-500"
                          : "border-brand-text-muted/30"
                      }`}
                    />
                  )}
                />

                {formErrors.lastName && (
                  <Text className="text-xs text-red-500 mt-1">
                    {formErrors.lastName.message}
                  </Text>
                )}
              </View>
            </View>

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
                    onFocus={() => scrollToOffset(100)}
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
                    placeholder="Create a strong password"
                    placeholderTextColor="#94A3B8"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    onFocus={() =>
                      scrollToOffset(Platform.OS === "android" ? 240 : 200)
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

            {/* Create account button */}
            <Pressable
              onPress={handleSubmit(onSignUpPress)}
              className="h-14 items-center justify-center rounded-xl bg-brand-primary mt-2 active:opacity-80"
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text className="text-base font-semibold text-white">
                  Create account
                </Text>
              )}
            </Pressable>
          </View>

          {/* Login */}
          <View className="flex-row justify-center mt-8">
            <Text className="text-brand-text-muted">
              Already have an account?{" "}
            </Text>

            <Pressable onPress={() => router.push("/(auth)/sign-in")}>
              <Text className="font-semibold text-brand-primary">Sign in</Text>
            </Pressable>
          </View>
          <View>
            <View nativeID="clerk-captcha" />
          </View>

          {/* Bottom spacer so inputs can scroll well above the keyboard */}
          <View style={{ height: isKeyboardVisible ? 240 : 20 }} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
