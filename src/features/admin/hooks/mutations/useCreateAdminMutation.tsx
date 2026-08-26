import { useCreateAdminMutation as useCreateAdmin } from "@/src/store/api";

export default function useCreateAdminMutation() {
  const [createAdmin, { isLoading, isError, error, isSuccess }] =
    useCreateAdmin();
  return { createAdmin, isLoading, isError, error, isSuccess };
}
