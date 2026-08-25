import { useLocalSearchParams } from "expo-router";
import DoctorDetailScreen from "@/src/features/doctor/screens/DoctorDetailScreen";

export default function DoctorDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <DoctorDetailScreen id={id || ""} />;
}
