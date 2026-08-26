import { useGetAdminsQuery as useGetAdmins } from "@/src/store/api";

export default function useGetAdminsQuery(args?: any, options?: any) {
  return useGetAdmins(args, options);
}
