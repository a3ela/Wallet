import { SignInFormSchema, signInSchema } from "@/lib/schemas/auth";
import { useSignIn } from "@clerk/expo";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const SignIn = () => {
  const { signIn, errors, fetchStatus } = useSignIn();

  const isLoading = fetchStatus === "fetching";

  const {
    control,
    handleSubmit,
    formState: { errors: formErrors },
  } = useForm<SignInFormSchema>({
    resolver: zodResolver(signInSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSignInPress = async (values: SignInFormSchema) => {
    const { error } = await signIn.password({
      identifier: values.email,
      password: values.password,
    });

    if (error) {
      console.error(JSON.stringify(error, null, 2));
      return;
    }

    if (signIn.status === "complete") {
      await signIn.finalize();
    }
  };

  return (
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
              Welcome Back
            </Text>

            <Text className="text-brand-text-muted text-center text-base mt-2">
              Sign in to continue to your account
            </Text>
          </View>

          <View className="gap-5">
            <View>
              <Text className="text-sm font-semibold text-[#1A1D26] mb-2">
                Email Address
              </Text>

              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className="h-14 px-4 border border-[#D8D9DE] rounded-xl bg-white text-[#1A1D26]"
                    placeholder="you@example.com"
                    placeholderTextColor="#8A8D96"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
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
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-sm font-semibold text-[#1A1D26]">
                  Password
                </Text>

                <Link href="/forgot-password">
                  <Text className="text-xs text-brand-blue font-semibold">
                    Forgot Password?
                  </Text>
                </Link>
              </View>

              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className="h-14 px-4 border border-[#D8D9DE] rounded-xl bg-white text-[#1A1D26]"
                    placeholder="••••••••"
                    placeholderTextColor="#8A8D96"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    secureTextEntry
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                )}
              />

              {formErrors.password && (
                <Text className="text-xs text-red-500 mt-1">
                  {formErrors.password.message}
                </Text>
              )}

              {errors?.fields?.password && (
                <Text className="text-xs text-red-500 mt-1">
                  {errors.fields.password.message}
                </Text>
              )}
            </View>

            {/* Clerk general error */}
            {errors?.global && (
              <Text className="text-xs text-red-500 text-center">
                {errors.global.map((error) => error.message).join(" ")}
              </Text>
            )}

            <TouchableOpacity
              className="h-14 rounded-xl bg-primary items-center justify-center mt-2 active:opacity-80"
              onPress={handleSubmit(onSignInPress)}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white text-base font-semibold">
                  Sign In
                </Text>
              )}
            </TouchableOpacity>

            <View className="flex-row justify-center">
              <Text className="text-brand-text-muted">
                Don&apos;t have an account?{" "}
              </Text>

              <Link href="/sign-up">
                <Text className="text-brand-blue font-semibold">Sign Up</Text>
              </Link>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignIn;
