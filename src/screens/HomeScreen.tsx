import React, { useState } from 'react';
import { View, TouchableOpacity, ScrollView, FlatList, useColorScheme } from 'react-native';
import { router } from 'expo-router';
import { Search, Calendar, Award, MapPin, User, LogOut, CheckCircle, Clock } from 'lucide-react-native';

import { useAppSelector, useAppDispatch } from '../store/hooks';
import { logout } from '../store/slices/authSlice';
import { useGetSpecializationsQuery, useGetAvailableDoctorsQuery } from '../store/api/doctorApi';
import { useGetAppointmentsQuery } from '../store/api/appointmentApi';
import ScreenWrapper from '../components/common/ScreenWrapper';
import AppText from '../components/common/AppText';
import AppCard from '../components/common/AppCard';
import AppInput from '../components/form/AppInput';
import AppLoader from '../components/common/AppLoader';
import { useForm } from 'react-hook-form';

export const HomeScreen: React.FC = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const dispatch = useAppDispatch();

  const primaryColor = isDark ? '#14B8A6' : '#0F766E';
  const primaryLight = isDark ? '#115E59' : '#CCFBF1';
  const accentColor = isDark ? '#60A5FA' : '#3B82F6';
  const successColor = isDark ? '#34D399' : '#10B981';
  const mutedColor = isDark ? '#64748B' : '#94A3B8';
  const textColor = isDark ? '#F8FAFC' : '#0F172A';
  const borderColor = isDark ? '#222F4C' : '#E2E8F0';

  const user = useAppSelector((state) => state.auth.user);
  const isPatient = user?.role === 'patient';
  const isDoctor = user?.role === 'doctor';

  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const { control } = useForm({ defaultValues: { search: '' } });

  const { data: specResponse } = useGetSpecializationsQuery({});
  const {
    data: doctorsResponse,
    isLoading: isLoadingDocs,
    refetch: refetchDocs,
    isFetching: isFetchingDocs,
  } = useGetAvailableDoctorsQuery({
    searchTerm: searchTerm || undefined,
    specializationId: selectedSpecialty || undefined,
  });

  const { data: appointmentsResponse } = useGetAppointmentsQuery(
    isDoctor ? { doctorId: user?.doctor?.id } : { patientId: user?.patient?.id }
  );

  const specializations = specResponse?.data || [];
  const availableDoctors = doctorsResponse?.data || [];
  const appointments = appointmentsResponse?.data || [];

  const handleSearch = (text: string) => setSearchTerm(text);
  const handleLogout = () => {
    dispatch(logout());
    router.replace('/login');
  };

  const renderPatientDashboard = () => (
    <View className="flex-1">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-4">
        <View>
          <AppText variant="bodySecondary">Welcome back,</AppText>
          <AppText weight="bold" variant="subtitle">
            {user?.profile?.fullName || 'Patient'}
          </AppText>
        </View>
        <TouchableOpacity
          onPress={handleLogout}
          className="w-9 h-9 rounded-full justify-center items-center"
          style={{ backgroundColor: borderColor }}
        >
          <LogOut size={16} color={textColor} />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View className="mb-4">
        <AppCard padding={8} style={{ borderRadius: 12 }}>
          <View className="flex-row items-center">
            <Search size={20} color={mutedColor} style={{ marginLeft: 8, marginRight: -4 }} />
            <ScrollView keyboardShouldPersistTaps="handled" className="flex-1">
              <AppInput
                name="search"
                control={control}
                placeholder="Search doctors, symptoms, clinics..."
                style={{ marginBottom: 0, borderWidth: 0, height: 40, backgroundColor: 'transparent' }}
                onChangeText={handleSearch}
              />
            </ScrollView>
          </View>
        </AppCard>
      </View>

      {/* Specialties */}
      <View className="mb-5">
        <AppText weight="bold" variant="body" className="mb-3">
          Clinical Specialties
        </AppText>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={specializations}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingRight: 20, gap: 8 }}
          renderItem={({ item }) => {
            const isSelected = selectedSpecialty === item.id;
            return (
              <TouchableOpacity
                onPress={() => setSelectedSpecialty(isSelected ? null : item.id)}
                className="py-2 px-4 rounded-full border-[1.5px]"
                style={{
                  backgroundColor: isSelected ? primaryColor : (isDark ? '#151D30' : '#FFFFFF'),
                  borderColor,
                }}
              >
                <AppText
                  weight="medium"
                  variant="bodySecondary"
                  color={isSelected ? '#FFFFFF' : textColor}
                >
                  {item.name}
                </AppText>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* Doctors */}
      <View className="mb-5">
        <AppText weight="bold" variant="body" className="mb-3">
          Available Consultants
        </AppText>
        {isLoadingDocs || isFetchingDocs ? (
          <AppLoader />
        ) : availableDoctors.length === 0 ? (
          <AppCard bordered>
            <AppText align="center" variant="bodySecondary">
              No active doctors found for the selected specialization or search query.
            </AppText>
          </AppCard>
        ) : (
          <FlatList
            data={availableDoctors}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            renderItem={({ item }: any) => {
              const docInfo = item.doctor;
              const specName = docInfo?.specialization?.name || 'General Practitioner';
              const fullName = docInfo?.doctor?.profile?.fullName || 'Consultant';
              return (
                <TouchableOpacity
                  onPress={() => router.push(`/doctor/${item.id}`)}
                  activeOpacity={0.9}
                >
                  <AppCard style={{ marginBottom: 12 }}>
                    <View className="flex-row items-center">
                      <View
                        className="w-[60px] h-[60px] rounded-full justify-center items-center mr-3"
                        style={{ backgroundColor: primaryLight }}
                      >
                        <User size={24} color={primaryColor} />
                      </View>
                      <View className="flex-1">
                        <AppText weight="bold" variant="body">{fullName}</AppText>
                        <AppText variant="bodySecondary" className="mt-0.5 mb-1.5">
                          {specName}
                        </AppText>
                        <View className="flex-row items-center mt-0.5 gap-1">
                          <Award size={14} color={primaryColor} />
                          <AppText variant="caption">{docInfo?.qualification || 'MBBS'}</AppText>
                        </View>
                        <View className="flex-row items-center mt-0.5 gap-1">
                          <MapPin size={14} color={mutedColor} />
                          <AppText variant="caption">
                            {item.availableDate
                              ? new Date(item.availableDate).toLocaleDateString()
                              : 'Available'}
                          </AppText>
                        </View>
                      </View>
                    </View>
                  </AppCard>
                </TouchableOpacity>
              );
            }}
          />
        )}
      </View>
    </View>
  );

  const renderDoctorDashboard = () => {
    const totalAppointments = appointments.length;
    const completedAppointments = appointments.filter((a: any) => a.status === 'COMPLETED').length;
    const scheduledAppointments = appointments.filter((a: any) => a.status === 'SCHEDULED').length;

    return (
      <View className="flex-1">
        {/* Header */}
        <View className="flex-row items-center justify-between mb-4">
          <View>
            <AppText variant="bodySecondary">Clinical Workspace</AppText>
            <AppText weight="bold" variant="subtitle">
              {user?.profile?.fullName || 'Doctor'}
            </AppText>
          </View>
          <TouchableOpacity
            onPress={handleLogout}
            className="w-9 h-9 rounded-full justify-center items-center"
            style={{ backgroundColor: borderColor }}
          >
            <LogOut size={16} color={textColor} />
          </TouchableOpacity>
        </View>

        {/* Stats Grid */}
        <View className="flex-row justify-between gap-2 mb-5">
          <AppCard style={{ flex: 1, padding: 12, alignItems: 'center' }} bordered={false}>
            <Clock size={20} color={accentColor} />
            <AppText weight="bold" variant="subtitle" style={{ fontSize: 22, marginVertical: 4 }}>
              {scheduledAppointments}
            </AppText>
            <AppText variant="caption">Pending Slots</AppText>
          </AppCard>
          <AppCard style={{ flex: 1, padding: 12, alignItems: 'center' }} bordered={false}>
            <CheckCircle size={20} color={successColor} />
            <AppText weight="bold" variant="subtitle" style={{ fontSize: 22, marginVertical: 4 }}>
              {completedAppointments}
            </AppText>
            <AppText variant="caption">Completed</AppText>
          </AppCard>
          <AppCard style={{ flex: 1, padding: 12, alignItems: 'center' }} bordered={false}>
            <Calendar size={20} color={primaryColor} />
            <AppText weight="bold" variant="subtitle" style={{ fontSize: 22, marginVertical: 4 }}>
              {totalAppointments}
            </AppText>
            <AppText variant="caption">Total Visits</AppText>
          </AppCard>
        </View>

        {/* Schedule List */}
        <View className="mb-5">
          <AppText weight="bold" variant="body" className="mb-3">
            Today's Consultations
          </AppText>
          {appointments.length === 0 ? (
            <AppCard bordered>
              <AppText align="center" variant="bodySecondary">
                No appointments booked for today. You are free!
              </AppText>
            </AppCard>
          ) : (
            <FlatList
              data={appointments}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              renderItem={({ item }: any) => {
                const patientName = item.patient?.patient?.profile?.fullName || 'Patient';
                const timeSlot = item.availableService?.slot;
                const timeString = timeSlot
                  ? `${timeSlot.startTime} - ${timeSlot.endTime}`
                  : 'Time unscheduled';
                return (
                  <AppCard style={{ marginBottom: 8 }}>
                    <View className="flex-row justify-between items-center mb-1">
                      <View className="flex-row items-center gap-1">
                        <User size={16} color={isDark ? '#94A3B8' : '#475569'} />
                        <AppText weight="semibold" style={{ fontSize: 14 }}>
                          {patientName}
                        </AppText>
                      </View>
                      <View
                        className="py-0.5 px-2 rounded-[4px]"
                        style={{ backgroundColor: primaryLight }}
                      >
                        <AppText weight="bold" variant="caption" color={primaryColor}>
                          {item.status}
                        </AppText>
                      </View>
                    </View>
                    <AppText variant="bodySecondary" style={{ fontSize: 13 }}>
                      Slot: {timeString}
                    </AppText>
                  </AppCard>
                );
              }}
            />
          )}
        </View>
      </View>
    );
  };

  return (
    <ScreenWrapper
      scrollable
      onRefresh={refetchDocs}
      refreshing={isLoadingDocs || isFetchingDocs}
      padding={16}
    >
      {isDoctor ? renderDoctorDashboard() : renderPatientDashboard()}
    </ScreenWrapper>
  );
};

export default HomeScreen;
