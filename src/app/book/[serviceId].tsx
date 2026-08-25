import { useLocalSearchParams } from "expo-router";
import BookingScreen from "@/src/features/appointment/screens/BookingScreen";

export default function BookingPage() {
  const { serviceId } = useLocalSearchParams<{ serviceId: string }>();
  return <BookingScreen availableServiceId={serviceId || ""} />;
}
