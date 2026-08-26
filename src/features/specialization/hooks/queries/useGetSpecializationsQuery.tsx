import { useGetSpecializationsQuery as useGetSpecializations } from "@/src/store/api";

export default function useGetSpecializationsQuery(args?: any, options?: any) {
  return useGetSpecializations(args, options);
}
