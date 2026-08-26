import { useUnsuspendUserMutation as useUnsuspendUser } from "@/src/store/api";

export default function useUnsuspendUserMutation() {
  const [unsuspendUser, { isLoading, isError, error, isSuccess }] =
    useUnsuspendUser();
  return { unsuspendUser, isLoading, isError, error, isSuccess };
}
