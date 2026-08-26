import { useDeleteAdminMutation as useDeleteAdmin } from "@/src/store/api";

export default function useDeleteAdminMutation() {
  const [deleteAdmin, { isLoading, isError, error, isSuccess }] =
    useDeleteAdmin();
  return { deleteAdmin, isLoading, isError, error, isSuccess };
}
