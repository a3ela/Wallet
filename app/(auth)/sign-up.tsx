import {
  CodeFormSchema,
  codeSchema,
  SignUpFormSchema,
  signUpSchema,
} from "@/lib/schemas/auth";
import { useAuth, useSignUp } from "@clerk/expo";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
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
  View,
} from "react-native";

export default function SignUpScreen() {
  const { signUp, errors, fetchStatus } = useSignUp();
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const isLoading = fetchStatus === "fetching";

  const {
    control,
    handleSubmit,
    formState: { errors: formErrors },
  } = useForm<SignUpFormSchema>({
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
    handleSubmit: handleCodeSubmit,
    formState: { errors: codeErrors },
  } = useForm<CodeFormSchema>({
    resolver: zodResolver(codeSchema),
    mode: "onBlur",
    defaultValues: {
      code: "",
    },
  });

  const onSignUpPress = async (data: SignUpFormSchema) => {
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

  const onVerifyPress = async (data: CodeFormSchema) => {};

  if (
    signUp.status === "missing_requirements" &&
    signUp.unverifiedFields.includes("email_address") &&
    signUp.missingFields.length === 0
  ) {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 bg-brand-body"
      >
        <View className="flex-1 justify-center px-6 -mt-16">
          <Image
            source={require("@/assets/images/logo.png")}
            className="w-36 h-20 mb-6"
            resizeMode="contain"
          />
        </View>
      </KeyboardAvoidingView>
    );
  }

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
        <View className="flex-1 px-6 pt-16">
          {/* Header */}
          <View className="items-center mb-10">
            <Image
              source={require("@/assets/images/logo.png")}
              className="w-36 h-20 mb-6"
              resizeMode="contain"
            />

            <Text className="text-3xl font-bold text-[#1A1D26] mb-2">
              Create an Account
            </Text>

            <Text className="text-base text-[#666] text-center leading-6">
              Join us today and start managing your finances
            </Text>
          </View>

          <View className="gap-5">
            <View className="flex-row gap-3">
              <View className="flex-1">
                <Text className="text-sm font-semibold text-[#1A1D26] mb-2">
                  First Name
                </Text>

                <Controller
                  control={control}
                  name="firstName"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      className="h-14 px-4 border border-[#D8D9DE] rounded-xl bg-white text-[#1A1D26]"
                      placeholder="John"
                      placeholderTextColor="#8A8D96"
                      value={value}
                      onChangeText={onChange}
                      autoCapitalize="words"
                    />
                  )}
                />

                {formErrors.firstName && (
                  <Text className="text-xs text-red-500 mt-1">
                    {formErrors.firstName.message}
                  </Text>
                )}
              </View>

              {/* Last Name */}
              <View className="flex-1">
                <Text className="text-sm font-semibold text-[#1A1D26] mb-2">
                  Last Name
                </Text>

                <Controller
                  control={control}
                  name="lastName"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      className="h-14 px-4 border border-[#D8D9DE] rounded-xl bg-white text-[#1A1D26]"
                      placeholder="Doe"
                      placeholderTextColor="#8A8D96"
                      value={value}
                      onChangeText={onChange}
                      autoCapitalize="words"
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
              <Text className="text-sm font-semibold text-[#1A1D26] mb-2">
                Email Address
              </Text>

              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    className="h-14 px-4 border border-[#D8D9DE] rounded-xl bg-white text-[#1A1D26]"
                    placeholder="you@example.com"
                    placeholderTextColor="#8A8D96"
                    value={value}
                    onChangeText={onChange}
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

                <Text className="text-xs text-[#888]">
                  Minimum 8 characters
                </Text>
              </View>

              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    className="h-14 px-4 border border-[#D8D9DE] rounded-xl bg-white text-[#1A1D26]"
                    placeholder="••••••••"
                    placeholderTextColor="#8A8D96"
                    value={value}
                    onChangeText={onChange}
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

            <Pressable
              className="h-14 rounded-xl bg-primary items-center justify-center mt-2 active:opacity-80"
              onPress={handleSubmit(onSignUpPress)}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-semibold text-base bg-primary">
                  Sign Up
                </Text>
              )}
            </Pressable>
          </View>

          <View className="flex-row justify-center mt-8">
            <Text className="text-[#666] text-sm">
              Already have an account?{" "}
            </Text>

            <Pressable onPress={() => router.push("/sign-in")}>
              <Text className="text-brand-primary text-sm font-bold">
                Sign In
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
