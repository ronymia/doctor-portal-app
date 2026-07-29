import { useLocalSearchParams } from "expo-router";
import DoctorDetailScreen from "../../src/screens/doctor/DoctorDetailScreen";

export default function DoctorDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <DoctorDetailScreen id={id || ""} />;
}
