import { useApproveDoctorMutation as useApproveDoctor } from "@/src/store/api";

export default function useApproveDoctorMutation() {
  const [approveDoctor, { isLoading, isError, error, isSuccess }] =
    useApproveDoctor();
  return { approveDoctor, isLoading, isError, error, isSuccess };
}
