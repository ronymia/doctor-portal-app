import { useDeleteDoctorMutation as useDeleteDoctor } from "@/src/store/api";

export default function useDeleteDoctorMutation() {
  const [deleteDoctor, { isLoading, isError, error, isSuccess }] =
    useDeleteDoctor();
  return { deleteDoctor, isLoading, isError, error, isSuccess };
}
