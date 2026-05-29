import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import BookingScreen from '../../src/screens/BookingScreen';

export default function BookingPage() {
  const { serviceId } = useLocalSearchParams<{ serviceId: string }>();
  return <BookingScreen availableServiceId={serviceId || ''} />;
}
