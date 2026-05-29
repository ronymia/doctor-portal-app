import React from 'react';
import { View, TouchableOpacity, useColorScheme, FlatList } from 'react-native';
import { router } from 'expo-router';
import { Calendar, Award, GraduationCap, Clock, Briefcase } from 'lucide-react-native';

import { useGetAvailableDoctorsQuery } from '../store/api/doctorApi';
import ScreenWrapper from '../components/common/ScreenWrapper';
import AppText from '../components/common/AppText';
import AppCard from '../components/common/AppCard';
import AppHeader from '../components/common/AppHeader';
import AppLoader from '../components/common/AppLoader';
import AppButton from '../components/common/AppButton';

interface DoctorDetailScreenProps {
  id: string;
}

export const DoctorDetailScreen: React.FC<DoctorDetailScreenProps> = ({ id }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const primaryColor = isDark ? '#14B8A6' : '#0F766E';
  const primaryLight = isDark ? '#115E59' : '#CCFBF1';
  const mutedColor = isDark ? '#64748B' : '#94A3B8';

  const { data: doctorsResponse, isLoading } = useGetAvailableDoctorsQuery({});

  if (isLoading) {
    return <AppLoader message="Retrieving consultant profile..." />;
  }

  const doctors = doctorsResponse?.data || [];
  const doctorDetail = doctors.find((d: any) => d.id === id);

  if (!doctorDetail) {
    return (
      <ScreenWrapper scrollable={false}>
        <AppHeader title="Not Found" showBackButton />
        <View className="flex-1 justify-center items-center p-5">
          <AppText align="center" variant="bodySecondary">
            Consultant details could not be found.
          </AppText>
        </View>
      </ScreenWrapper>
    );
  }

  const doctorRelation = doctorDetail.doctor;
  const user = doctorRelation?.doctor;
  const profile = user?.profile;
  const spec = doctorRelation?.specialization;
  const docProfile = doctorRelation?.doctorProfile;

  const fullName = profile?.fullName || 'Consultant';
  const qualification = doctorRelation?.qualification || 'MBBS';
  const experience = docProfile?.yearsOfExperience || 5;
  const license = docProfile?.licenseNumber || 'REG-100293';
  const availableServices = doctorDetail.availableServices || [];

  return (
    <ScreenWrapper scrollable={true} useSafeArea>
      <AppHeader title="Consultant Profile" showBackButton />

      <View className="p-4">
        {/* Profile Hero */}
        <AppCard style={{ alignItems: 'center', paddingVertical: 20, marginBottom: 16 }} bordered={false}>
          <View
            className="w-20 h-20 rounded-full justify-center items-center mb-3"
            style={{ backgroundColor: primaryLight }}
          >
            <AppText weight="bold" variant="title" color={primaryColor}>
              {fullName.charAt(0)}
            </AppText>
          </View>
          <AppText weight="bold" variant="subtitle" align="center" style={{ fontSize: 22 }}>
            {fullName}
          </AppText>
          <AppText variant="bodySecondary" align="center" className="mt-1">
            {spec?.name || 'General Consultant'}
          </AppText>
        </AppCard>

        {/* Credentials Row */}
        <View className="flex-row gap-2 mb-5">
          <AppCard style={{ flex: 1, padding: 12, alignItems: 'center' }} bordered>
            <GraduationCap size={20} color={primaryColor} />
            <AppText weight="bold" style={{ fontSize: 13, marginVertical: 4, textAlign: 'center' }}>
              {qualification}
            </AppText>
            <AppText variant="caption">Education</AppText>
          </AppCard>
          <AppCard style={{ flex: 1, padding: 12, alignItems: 'center' }} bordered>
            <Briefcase size={20} color={primaryColor} />
            <AppText weight="bold" style={{ fontSize: 13, marginVertical: 4, textAlign: 'center' }}>
              {experience} Years
            </AppText>
            <AppText variant="caption">Experience</AppText>
          </AppCard>
          <AppCard style={{ flex: 1, padding: 12, alignItems: 'center' }} bordered>
            <Award size={20} color={primaryColor} />
            <AppText weight="bold" style={{ fontSize: 13, marginVertical: 4, textAlign: 'center' }}>
              Active
            </AppText>
            <AppText variant="caption">Lic: {license}</AppText>
          </AppCard>
        </View>

        {/* About Specialty */}
        {spec?.description && (
          <View className="mb-5">
            <AppText weight="bold" variant="body" className="mb-3">About Specialty</AppText>
            <AppCard bordered>
              <AppText variant="bodySecondary" style={{ lineHeight: 22 }}>
                {spec.description}
              </AppText>
            </AppCard>
          </View>
        )}

        {/* Bookable Services */}
        <View className="mb-5">
          <AppText weight="bold" variant="body" className="mb-3">Bookable Consultations</AppText>
          {availableServices.length === 0 ? (
            <AppCard style={{ padding: 20, justifyContent: 'center', alignItems: 'center' }} bordered>
              <AppText align="center" variant="bodySecondary">
                This consultant currently has no active clinical slots or bookings open.
              </AppText>
            </AppCard>
          ) : (
            <FlatList
              data={availableServices}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              renderItem={({ item }: any) => {
                const serviceInfo = item.service;
                const slot = item.slot;
                const isBooked = item.isBooked;
                return (
                  <AppCard style={{ marginBottom: 12 }}>
                    <View className="flex-row justify-between items-start mb-3">
                      <View className="flex-1">
                        <AppText weight="bold" variant="body">
                          {serviceInfo?.name || 'General Consultation'}
                        </AppText>
                        <AppText variant="bodySecondary" style={{ fontSize: 13, marginTop: 2 }}>
                          {serviceInfo?.description || 'Routine medical diagnostics'}
                        </AppText>
                      </View>
                      <AppText weight="bold" variant="body" color={primaryColor}>
                        ৳{item.fees}
                      </AppText>
                    </View>
                    <View className="flex-row items-center mb-4">
                      <Clock size={16} color={mutedColor} />
                      <AppText variant="caption" className="ml-1">
                        Slot: {slot ? `${slot.startTime} - ${slot.endTime}` : 'TBD'}
                      </AppText>
                      <Calendar size={16} color={mutedColor} className="ml-4" />
                      <AppText variant="caption" className="ml-1">
                        Date: {item.slotDate ? new Date(item.slotDate).toLocaleDateString() : 'TBD'}
                      </AppText>
                    </View>
                    <AppButton
                      title={isBooked ? 'Slot Booked' : 'Book Consultation'}
                      disabled={isBooked}
                      onPress={() => router.push(`/book/${item.id}`)}
                      style={{ height: 44 }}
                    />
                  </AppCard>
                );
              }}
            />
          )}
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default DoctorDetailScreen;
