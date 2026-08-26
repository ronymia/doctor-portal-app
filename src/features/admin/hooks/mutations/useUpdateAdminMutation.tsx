import { useUpdateAdminMutation as useUpdateAdmin } from "@/src/store/api";

export default function useUpdateAdminMutation() {
  const [updateAdmin, { isLoading, isError, error, isSuccess }] =
    useUpdateAdmin();
  return { updateAdmin, isLoading, isError, error, isSuccess };
}
