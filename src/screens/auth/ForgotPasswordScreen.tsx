import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { CheckCircle, Mail } from "lucide-react-native";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { View } from "react-native";
import * as z from "zod";

import AppButton from "@/src/components/common/AppButton";
import AppCard from "@/src/components/common/AppCard";
import AppHeader from "@/src/components/common/AppHeader";
import AppText from "@/src/components/common/AppText";
import ScreenWrapper from "@/src/components/common/ScreenWrapper";
import AppInput from "@/src/components/form/AppInput";
import { useTheme } from "@/src/hooks/useTheme";

const forgotPasswordSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
});

type TForgotPasswordFields = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordScreen() {
  const { colors } = useTheme();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const successColor = colors.success;
  const iconColor = colors.textMuted;

  const { control, handleSubmit } = useForm<TForgotPasswordFields>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: TForgotPasswordFields) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
    }, 1500);
  };

  return (
    <ScreenWrapper scrollable={false} useSafeArea>
      <AppHeader title="Reset Password" showBackButton />

      <View className="flex-1 px-5 justify-center">
        {isSuccess ? (
          <AppCard style={{ alignItems: "center", paddingVertical: 28 }}>
            <View
              className="w-20 h-20 rounded-full justify-center items-center mb-5"
              style={{ backgroundColor: successColor + "15" }}
            >
              <CheckCircle size={48} color={successColor} />
            </View>
            <AppText
              weight="bold"
              variant="subtitle"
              align="center"
              className="mb-3"
            >
              Check Your Email
            </AppText>
            <AppText
              variant="bodySecondary"
              align="center"
              style={{ lineHeight: 22 }}
              className="mb-7"
            >
              We have sent password recovery instructions and a secure reset
              token link to your registered email address.
            </AppText>
            <AppButton
              title="Return to Log In"
              onPress={() => router.replace("/login")}
              style={{ width: "100%" }}
            />
          </AppCard>
        ) : (
          <View className="w-full">
            <AppText
              variant="bodySecondary"
              style={{ lineHeight: 22 }}
              className="mb-5"
            >
              Please enter your registered email address. We will verify the
              account and send you a link to reset your password.
            </AppText>
            <AppCard style={{ width: "100%" }}>
              <AppInput
                name="email"
                control={control}
                label="Email Address"
                placeholder="name@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                icon={<Mail size={18} color={iconColor} />}
              />
              <AppButton
                title="Send Recovery Link"
                onPress={handleSubmit(onSubmit)}
                loading={isLoading}
                style={{ marginTop: 8, width: "100%" }}
              />
            </AppCard>
          </View>
        )}
      </View>
    </ScreenWrapper>
  );
}
