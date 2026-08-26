import { useGetUsersQuery } from "@/src/store/api";

export default function useDoctorQuery() {
  return useGetUsersQuery({ role: "DOCTOR" });
}
