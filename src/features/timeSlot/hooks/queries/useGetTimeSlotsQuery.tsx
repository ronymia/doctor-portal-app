import { useGetTimeSlotsQuery as useGetTimeSlots } from "@/src/store/api";

export default function useGetTimeSlotsQuery(args?: any, options?: any) {
  return useGetTimeSlots(args, options);
}
