import { useRejectDoctorMutation as useRejectDoctor } from "@/src/store/api";

export default function useRejectDoctorMutation() {
  const [rejectDoctor, { isLoading, isError, error, isSuccess }] =
    useRejectDoctor();
  return { rejectDoctor, isLoading, isError, error, isSuccess };
}
