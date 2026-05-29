import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { Mail, Stethoscope } from "lucide-react-native";
import React from "react";
import { useForm } from "react-hook-form";
import { TouchableOpacity, useColorScheme, View } from "react-native";
import * as z from "zod";

import AppButton from "../components/common/AppButton";
import AppCard from "../components/common/AppCard";
import AppText from "../components/common/AppText";
import ScreenWrapper from "../components/common/ScreenWrapper";
import AppInput from "../components/form/AppInput";
import AppPasswordInput from "../components/form/AppPasswordInput";
import { useLoginMutation } from "../store/api/authApi";
import { useAppDispatch } from "../store/hooks";
import { setCredentials } from "../store/slices/authSlice";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFields = z.infer<typeof loginSchema>;

export const LoginScreen: React.FC = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const dispatch = useAppDispatch();
  const [login, { isLoading, error }] = useLoginMutation();

  const primaryColor = isDark ? "#14B8A6" : "#0F766E";
  const primaryLight = isDark ? "#115E59" : "#CCFBF1";
  const errorColor = isDark ? "#F87171" : "#EF4444";
  const iconColor = isDark ? "#64748B" : "#94A3B8";

  const { control, handleSubmit } = useForm<LoginFields>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginFields) => {
    try {
      console.log("Data: ", data);
      const response = await login(data).unwrap();
      if (response && response.success && response.data) {
        const { access_token, user } = response.data;
        dispatch(setCredentials({ token: access_token, user }));
        router.replace("/(tabs)");
      }
    } catch (err) {
      console.log("Error from Login Screen: ", err);
    }
  };

  const getErrorMessage = () => {
    if (!error) return null;
    if ("data" in error) {
      const data = error.data as any;
      return data?.message || "Login failed. Please check your credentials.";
    }
    return "Network connection error. Please try again.";
  };

  return (
    <ScreenWrapper scrollable padding={20}>
      <View className="flex-1 justify-center py-7">
        {/* Brand Logo Header */}
        <View className="items-center mb-7">
          <View
            className="w-[72px] h-[72px] rounded-full justify-center items-center mb-3"
            style={{ backgroundColor: primaryLight }}
          >
            <Stethoscope size={36} color={primaryColor} />
          </View>
          <AppText
            weight="bold"
            variant="title"
            align="center"
            style={{ fontSize: 28 }}
          >
            MedPortal
          </AppText>
          <AppText variant="bodySecondary" align="center" className="mt-1">
            Your premium clinical consultation workspace
          </AppText>
        </View>

        {/* Login Form Card */}
        <AppCard>
          <AppText
            weight="bold"
            variant="subtitle"
            style={{ fontSize: 20 }}
            className="mb-4"
          >
            Sign In
          </AppText>

          {getErrorMessage() && (
            <View
              className="p-3 rounded-md border mb-4"
              style={{
                backgroundColor: errorColor + "15",
                borderColor: errorColor,
              }}
            >
              <AppText variant="error" weight="medium">
                {getErrorMessage()}
              </AppText>
            </View>
          )}

          <AppInput
            name="email"
            control={control}
            label="Email Address"
            placeholder="name@clinical.com"
            keyboardType="email-address"
            autoCapitalize="none"
            icon={<Mail size={18} color={iconColor} />}
          />

          <AppPasswordInput
            name="password"
            control={control}
            label="Password"
            placeholder="••••••••"
          />

          <TouchableOpacity
            onPress={() => router.push("/forgot-password")}
            className="self-end mb-5"
          >
            <AppText
              variant="bodySecondary"
              weight="medium"
              color={primaryColor}
            >
              Forgot Password?
            </AppText>
          </TouchableOpacity>

          <AppButton
            title="Log In"
            onPress={handleSubmit(onSubmit)}
            loading={isLoading}
            style={{ width: "100%" }}
          />
        </AppCard>

        {/* Footer Actions */}
        <View className="flex-row justify-center items-center mt-7">
          <AppText variant="bodySecondary">New to MedPortal? </AppText>
          <TouchableOpacity onPress={() => router.push("/register")}>
            <AppText weight="bold" color={primaryColor}>
              Create Account
            </AppText>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default LoginScreen;
