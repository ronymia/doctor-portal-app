import { useGetUsersQuery as useGetUsers } from "@/src/store/api";

export default function useGetUsersQuery(args?: any, options?: any) {
  return useGetUsers(args, options);
}
