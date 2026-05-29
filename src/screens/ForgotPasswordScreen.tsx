import React, { useState } from 'react';
import { View, TouchableOpacity, useColorScheme } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { router } from 'expo-router';
import { Mail, CheckCircle } from 'lucide-react-native';

import ScreenWrapper from '../components/common/ScreenWrapper';
import AppText from '../components/common/AppText';
import AppInput from '../components/form/AppInput';
import AppButton from '../components/common/AppButton';
import AppCard from '../components/common/AppCard';
import AppHeader from '../components/common/AppHeader';

const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
});

type ForgotPasswordFields = z.infer<typeof forgotPasswordSchema>;

export const ForgotPasswordScreen: React.FC = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const successColor = isDark ? '#34D399' : '#10B981';
  const iconColor = isDark ? '#64748B' : '#94A3B8';

  const { control, handleSubmit } = useForm<ForgotPasswordFields>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data: ForgotPasswordFields) => {
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
          <AppCard style={{ alignItems: 'center', paddingVertical: 28 }}>
            <View
              className="w-20 h-20 rounded-full justify-center items-center mb-5"
              style={{ backgroundColor: successColor + '15' }}
            >
              <CheckCircle size={48} color={successColor} />
            </View>
            <AppText weight="bold" variant="subtitle" align="center" className="mb-3">
              Check Your Email
            </AppText>
            <AppText variant="bodySecondary" align="center" style={{ lineHeight: 22 }} className="mb-7">
              We have sent password recovery instructions and a secure reset token link to
              your registered email address.
            </AppText>
            <AppButton
              title="Return to Log In"
              onPress={() => router.replace('/login')}
              style={{ width: '100%' }}
            />
          </AppCard>
        ) : (
          <View className="w-full">
            <AppText variant="bodySecondary" style={{ lineHeight: 22 }} className="mb-5">
              Please enter your registered email address. We will verify the account and
              send you a link to reset your password.
            </AppText>
            <AppCard style={{ width: '100%' }}>
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
                style={{ marginTop: 8, width: '100%' }}
              />
            </AppCard>
          </View>
        )}
      </View>
    </ScreenWrapper>
  );
};

export default ForgotPasswordScreen;
