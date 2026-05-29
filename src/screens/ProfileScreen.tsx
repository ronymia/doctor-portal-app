import React from 'react';
import { View, TouchableOpacity, useColorScheme } from 'react-native';
import { router } from 'expo-router';
import { Mail, Phone, MapPin, HeartPulse, LogOut, Award, Shield } from 'lucide-react-native';

import { useAppSelector, useAppDispatch } from '../store/hooks';
import { logout } from '../store/slices/authSlice';
import ScreenWrapper from '../components/common/ScreenWrapper';
import AppText from '../components/common/AppText';
import AppCard from '../components/common/AppCard';
import AppButton from '../components/common/AppButton';

export const ProfileScreen: React.FC = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const dispatch = useAppDispatch();

  const primaryColor = isDark ? '#14B8A6' : '#0F766E';
  const primaryLight = isDark ? '#115E59' : '#CCFBF1';

  const user = useAppSelector((state) => state.auth.user);
  const isPatient = user?.role === 'patient';
  const isDoctor = user?.role === 'doctor';

  const handleLogout = () => {
    dispatch(logout());
    router.replace('/login');
  };

  const getProfileHeaderLabel = () => {
    switch (user?.role) {
      case 'super_admin': return 'Super Administrator';
      case 'admin':       return 'Portal Administrator';
      case 'doctor':      return 'Medical Consultant';
      case 'patient':     return 'Clinical Patient';
      default:            return 'MedPortal User';
    }
  };

  return (
    <ScreenWrapper scrollable useSafeArea padding={16}>
      {/* Page Header */}
      <View className="mb-5">
        <AppText weight="bold" variant="title">My Account</AppText>
        <AppText variant="bodySecondary">
          Review clinical profile parameters and app configurations
        </AppText>
      </View>

      {/* Hero Card */}
      <AppCard style={{ alignItems: 'center', paddingVertical: 20, marginBottom: 20 }} bordered={false}>
        <View
          className="w-16 h-16 rounded-full justify-center items-center mb-3"
          style={{ backgroundColor: primaryLight }}
        >
          <AppText weight="bold" variant="subtitle" color={primaryColor}>
            {user?.profile?.fullName ? user.profile.fullName.charAt(0) : 'U'}
          </AppText>
        </View>
        <AppText weight="bold" variant="body" align="center" style={{ fontSize: 16 }}>
          {user?.profile?.fullName || 'Portal User'}
        </AppText>
        <AppText variant="caption" align="center" className="mt-0.5">
          {getProfileHeaderLabel()}
        </AppText>
      </AppCard>

      {/* Contact Info */}
      <View className="mb-5">
        <AppText weight="bold" variant="body" className="mb-3">Contact Information</AppText>
        <AppCard style={{ width: '100%' }}>
          <View className="flex-row items-center mb-4 gap-2">
            <Mail size={18} color={primaryColor} />
            <View className="flex-1">
              <AppText variant="caption">Email Address</AppText>
              <AppText weight="medium">{user?.email || 'N/A'}</AppText>
            </View>
          </View>
          <View className="flex-row items-center mb-4 gap-2">
            <Phone size={18} color={primaryColor} />
            <View className="flex-1">
              <AppText variant="caption">Phone Number</AppText>
              <AppText weight="medium">{user?.phoneNumber || 'N/A'}</AppText>
            </View>
          </View>
          <View className="flex-row items-center mb-4 gap-2">
            <MapPin size={18} color={primaryColor} />
            <View className="flex-1">
              <AppText variant="caption">Home Address</AppText>
              <AppText weight="medium">{user?.profile?.address || 'N/A'}</AppText>
            </View>
          </View>
        </AppCard>
      </View>

      {/* Patient Records */}
      {isPatient && (
        <View className="mb-5">
          <AppText weight="bold" variant="body" className="mb-3">Patient Medical Records</AppText>
          <AppCard style={{ width: '100%' }}>
            <View className="flex-row items-center mb-4 gap-2">
              <Shield size={18} color={primaryColor} />
              <View className="flex-1">
                <AppText variant="caption">Emergency Contact Phone</AppText>
                <AppText weight="medium">{user?.patient?.emergencyContact || 'N/A'}</AppText>
              </View>
            </View>
            <View className="flex-row items-center mb-4 gap-2">
              <HeartPulse size={18} color={primaryColor} />
              <View className="flex-1">
                <AppText variant="caption">Medical History & Symptoms Summary</AppText>
                <AppText weight="medium" style={{ lineHeight: 18, marginTop: 2 }}>
                  {user?.patient?.medicalHistory || 'No records provided yet.'}
                </AppText>
              </View>
            </View>
          </AppCard>
        </View>
      )}

      {/* Doctor Credentials */}
      {isDoctor && (
        <View className="mb-5">
          <AppText weight="bold" variant="body" className="mb-3">Clinical Practitioner Credentials</AppText>
          <AppCard style={{ width: '100%' }}>
            <View className="flex-row items-center mb-4 gap-2">
              <Award size={18} color={primaryColor} />
              <View className="flex-1">
                <AppText variant="caption">Qualifications</AppText>
                <AppText weight="medium">{user?.doctor?.qualification || 'MBBS'}</AppText>
              </View>
            </View>
            <View className="flex-row items-center mb-4 gap-2">
              <Shield size={18} color={primaryColor} />
              <View className="flex-1">
                <AppText variant="caption">Practitioner Identifier</AppText>
                <AppText weight="medium">ID: {user?.doctor?.doctorId || 'N/A'}</AppText>
              </View>
            </View>
          </AppCard>
        </View>
      )}

      <AppButton
        title="Log Out Session"
        variant="outline"
        icon={<LogOut size={16} color={primaryColor} />}
        onPress={handleLogout}
        style={{ marginTop: 12, marginBottom: 36, width: '100%' }}
      />
    </ScreenWrapper>
  );
};

export default ProfileScreen;
