import React from 'react';
import { View, TouchableOpacity, useColorScheme } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { router } from 'expo-router';
import { User, Phone, MapPin, ShieldAlert, Mail } from 'lucide-react-native';

import { useRegisterPatientMutation } from '../store/api/authApi';
import ScreenWrapper from '../components/common/ScreenWrapper';
import AppText from '../components/common/AppText';
import AppInput from '../components/form/AppInput';
import AppPasswordInput from '../components/form/AppPasswordInput';
import AppPhoneInput from '../components/form/AppPhoneInput';
import AppDateInput from '../components/form/AppDateInput';
import AppSelect from '../components/form/AppSelect';
import AppTextarea from '../components/form/AppTextarea';
import AppButton from '../components/common/AppButton';
import AppCard from '../components/common/AppCard';

const registerSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  phoneNumber: z.string().min(10, 'Valid phone number is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER'] as const),
  address: z.string().min(1, 'Address is required'),
  medicalHistory: z.string().min(1, 'Medical history is required'),
  emergencyContact: z.string().min(1, 'Emergency contact phone is required'),
});

type RegisterFields = z.infer<typeof registerSchema>;

export const RegisterScreen: React.FC = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [registerPatient, { isLoading, error }] = useRegisterPatientMutation();

  const primaryColor = isDark ? '#14B8A6' : '#0F766E';
  const errorColor = isDark ? '#F87171' : '#EF4444';
  const iconColor = isDark ? '#64748B' : '#94A3B8';

  const { control, handleSubmit } = useForm<RegisterFields>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phoneNumber: '',
      password: '',
      gender: 'MALE',
      address: '',
      medicalHistory: '',
      emergencyContact: '',
    },
  });

  const onSubmit = async (data: RegisterFields) => {
    try {
      const formData = new FormData();
      const payload = {
        email: data.email,
        phoneNumber: `+880${data.phoneNumber}`,
        password: data.password,
        patient: {
          medicalHistory: data.medicalHistory,
          emergencyContact: data.emergencyContact,
        },
        profile: {
          fullName: data.fullName,
          joiningDate: new Date().toISOString(),
          gender: data.gender,
          address: data.address,
          dateOfBirth: new Date().toISOString(),
          profilePicture: 'default.png',
        },
      };
      formData.append('data', JSON.stringify(payload));
      formData.append('file', {
        uri: 'file:///dummy.png',
        name: 'profile.png',
        type: 'image/png',
      } as any);

      const response = await registerPatient(formData).unwrap();
      if (response && response.success) {
        alert('Patient registered successfully! You can now log in.');
        router.replace('/login');
      }
    } catch (err) {}
  };

  const getErrorMessage = () => {
    if (!error) return null;
    if ('data' in error) {
      const data = error.data as any;
      return data?.message || 'Registration failed. Please check validation rules.';
    }
    return 'Network connection error.';
  };

  const genderOptions = [
    { label: 'Male', value: 'MALE' },
    { label: 'Female', value: 'FEMALE' },
    { label: 'Other', value: 'OTHER' },
  ];

  return (
    <ScreenWrapper scrollable padding={20}>
      <View className="py-4">
        <View className="mb-5">
          <AppText weight="bold" variant="title">Register Account</AppText>
          <AppText variant="bodySecondary" className="mt-1">
            Enter patient credentials to request portal credentials
          </AppText>
        </View>

        {getErrorMessage() && (
          <View
            className="p-3 rounded-md border mb-4"
            style={{ backgroundColor: errorColor + '15', borderColor: errorColor }}
          >
            <AppText variant="error" weight="medium">
              {getErrorMessage()}
            </AppText>
          </View>
        )}

        <AppCard style={{ width: '100%' }}>
          <AppInput
            name="fullName"
            control={control}
            label="Full Name"
            placeholder="Dr. John Doe"
            icon={<User size={18} color={iconColor} />}
          />
          <AppInput
            name="email"
            control={control}
            label="Email Address"
            placeholder="johndoe@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            icon={<Mail size={18} color={iconColor} />}
          />
          <AppPhoneInput
            name="phoneNumber"
            control={control}
            label="Phone Number"
          />
          <AppPasswordInput
            name="password"
            control={control}
            label="Password"
            placeholder="••••••••"
          />
          <AppSelect
            name="gender"
            control={control}
            label="Gender"
            options={genderOptions}
          />
          <AppInput
            name="address"
            control={control}
            label="Home Address"
            placeholder="123 Clinical St."
            icon={<MapPin size={18} color={iconColor} />}
          />
          <AppInput
            name="emergencyContact"
            control={control}
            label="Emergency Contact Phone"
            placeholder="+880170000000"
            keyboardType="phone-pad"
            icon={<ShieldAlert size={18} color={iconColor} />}
          />
          <AppTextarea
            name="medicalHistory"
            control={control}
            label="Medical History / Symptoms"
            placeholder="Enter past conditions, operations, allergies, or ongoing medications..."
            numberOfLines={4}
          />
          <AppButton
            title="Create Patient Account"
            onPress={handleSubmit(onSubmit)}
            loading={isLoading}
            style={{ marginTop: 12, width: '100%' }}
          />
        </AppCard>

        <View className="flex-row justify-center items-center mt-7 mb-9">
          <AppText variant="bodySecondary">Already have an account? </AppText>
          <TouchableOpacity onPress={() => router.push('/login')}>
            <AppText weight="bold" color={primaryColor}>
              Log In
            </AppText>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default RegisterScreen;
