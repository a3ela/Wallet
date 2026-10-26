import {
  CodeFormSchema,
  codeSchema,
  signUpFormValues,
  signUpSchema,
} from "@/lib/schemas/auth.schema";
import { useAuth, useSignUp } from "@clerk/expo";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const CODE_LENGTH = 6;

export default function SignUp() {
  const { signUp, errors, fetchStatus } = useSignUp();
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const isLoading = fetchStatus === "fetching";

  const [email, setEmail] = useState("");
  const inputRef = useRef<TextInput>(null);

  const {
    control,
    handleSubmit,
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
    }

    if (!error) await signUp.verifications.sendEmailCode();
  };

  const onVerifyPress = async ({ code }: { code: string }) => {
    await signUp.verifications.verifyEmailCode({ code });

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
  };

  if (
    signUp.status === "missing_requirements" &&
    signUp.unverifiedFields.includes("email_address") &&
    signUp.missingFields.length === 0
  ) {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 bg-(--background)"
      >
        <View className="flex-1 justify-center px-6">
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
              <Pressable onPress={() => signUp.verifications.sendEmailCode()}>
                <Text className="text-sm font-semibold text-brand-primary">
                  Resend
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-(--background)"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerClassName="flex-grow px-6 py-12"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 justify-center">
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
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
