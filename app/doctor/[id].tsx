import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import DoctorDetailScreen from '../../src/screens/DoctorDetailScreen';

export default function DoctorDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <DoctorDetailScreen id={id || ''} />;
}
