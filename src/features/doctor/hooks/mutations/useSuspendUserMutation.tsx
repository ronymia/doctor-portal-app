import { useSuspendUserMutation as useSuspendUser } from "@/src/store/api";

export default function useSuspendUserMutation() {
  const [suspendUser, { isLoading, isError, error, isSuccess }] =
    useSuspendUser();
  return { suspendUser, isLoading, isError, error, isSuccess };
}
