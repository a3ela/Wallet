import {
  CodeFormSchema,
  codeSchema,
  SignUpFormSchema,
  signUpSchema,
} from "@/lib/schemas/auth";
import { useSignUp } from "@clerk/expo";
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

const SignUp = () => {
  const { signUp, errors, fetchStatus } = useSignUp();

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
    handleSubmit: codeHandleSubmit,
    formState: { errors: codeFormErrors },
  } = useForm<CodeFormSchema>({
    resolver: zodResolver(codeSchema),
    mode: "onBlur",
    defaultValues: {
      code: "",
    },
  });

  const onSignUpPress = async (values: SignUpFormSchema) => {
    const { error } = await signUp.password({
      firstName: values.firstName,
      lastName: values.lastName,
      emailAddress: values.email,
      password: values.password,
    });

    if (error) {
      console.error(JSON.stringify(error, null, 2));
    }

    if (!error) await signUp.verifications.sendEmailCode();
  };

  const verifyCodePress = async ({ code }: CodeFormSchema) => {
    const { error } = await signUp.verifications.verifyEmailCode({ code });

    if (error) {
      console.error(JSON.stringify(error, null, 2));
      return;
    }

    if (signUp.status === "complete") {
      await signUp.finalize();
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
        className="flex-1 bg-brand-body"
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <View className="flex-1 justify-center px-6 -mt-16">
            <View className="items-center mb-8">
              <Image
                source={require("@/assets/images/logo.png")}
                className="w-36 h-20 mb-6"
                resizeMode="contain"
              />
              <Text className="text-3xl font-bold text-[#1A1D26] mb-2">
                Verify Your Email
              </Text>
              <Text className="text-base text-[#666] text-center leading-6">
                We sent a verification code to your email address. Please enter
                it below.
              </Text>
            </View>

            <View className="gap-5">
              <View>
                <Text className="text-sm font-semibold text-[#1A1D26] mb-2">
                  Verification Code
                </Text>
                <Controller
                  control={codeControl}
                  name="code"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      className="h-14 px-4 border border-[#D8D9DE] rounded-xl bg-white text-[#1A1D26] text-center text-lg tracking-widest"
                      placeholder="123456"
                      placeholderTextColor="#8A8D96"
                      value={value}
                      onChangeText={onChange}
                      keyboardType="number-pad"
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                  )}
                />
                {codeFormErrors.code && (
                  <Text className="text-xs text-red-500 mt-1">
                    {codeFormErrors.code.message}
                  </Text>
                )}
                {errors?.fields?.code && (
                  <Text className="text-xs text-red-500 mt-1">
                    {errors.fields.code.message}
                  </Text>
                )}
              </View>

              <TouchableOpacity
                className="h-14 rounded-xl bg-primary items-center justify-center mt-2 active:opacity-80"
                onPress={codeHandleSubmit(verifyCodePress)}
              >
                {isLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white font-semibold text-base">
                    Verify & Continue
                  </Text>
                )}
              </TouchableOpacity>
              <Text className="text-sm text-[#666] text-center">
                Didn&apos;t receive the code?{" "}
                <Text
                  className="text-brand-blue font-semibold"
                  onPress={() => signUp.verifications.sendEmailCode()}
                >
                  Resend Code
                </Text>
              </Text>
            </View>
          </View>
        </ScrollView>
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
          paddingBottom: 40,
        }}
      >
        <View className="px-6 pt-16">
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
              Create Account
            </Text>
            <Text className="text-brand-text-muted text-center text-base mt-2">
              Create an account to get started!
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
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      className="h-14 px-4 border border-[#D8D9DE] rounded-xl bg-white text-[#1A1D26]"
                      placeholder="John"
                      onChangeText={onChange}
                      onBlur={onBlur}
                      value={value}
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
            <TouchableOpacity
              className="h-14 rounded-xl bg-primary items-center justify-center mt-2 active:opacity-80"
              onPress={handleSubmit(onSignUpPress)}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white text-base font-semibold">
                  Create Account
                </Text>
              )}
            </TouchableOpacity>

            <View className="flex-row justify-center">
              <Text className="text-brand-text-muted">
                Already have an account?{" "}
              </Text>
              <Link href="/sign-in">
                <Text className="text-brand-blue font-semibold">Sign In</Text>
              </Link>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignUp;
