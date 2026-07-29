import { ShieldAlert, UserCheck, XCircle } from "lucide-react-native";
import React from "react";
import { TouchableOpacity, useColorScheme, View } from "react-native";

import AppCard from "@/src/components/common/AppCard";
import AppLoader from "@/src/components/common/AppLoader";
import AppText from "@/src/components/common/AppText";
import EmptyState from "@/src/components/common/EmptyState";
import {
  useApproveDoctorMutation,
  useGetUsersQuery,
  useRejectDoctorMutation,
  useSuspendUserMutation,
} from "@/src/store/api/adminApi";
import AdminScreenLayout from "@/src/screens/components/AdminScreenLayout";

// ADMIN DOCTORS — FULLY SELF-CONTAINED SCREEN
const AdminDoctors: React.FC = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  // THEME COLOR PALETTE
  const mutedColor = isDark ? "#64748B" : "#94A3B8";
  const successColor = isDark ? "#34D399" : "#10B981";
  const warningColor = isDark ? "#FBBF24" : "#F59E0B";
  const errorColor = isDark ? "#F87171" : "#EF4444";

  const { data: allUsersResponse, isLoading, refetch } = useGetUsersQuery({});
  const allUsers = allUsersResponse?.data || [];

  const [approveDoctor] = useApproveDoctorMutation();
  const [rejectDoctor] = useRejectDoctorMutation();
  const [suspendUser] = useSuspendUserMutation();

  const handleApprove = async (id: string) => {
    try {
      await approveDoctor(id).unwrap();
      alert("Doctor account approved successfully.");
      refetch();
    } catch (err: any) {
      alert(err?.data?.message || "Failed to approve doctor account.");
    }
  };

  const handleReject = async (id: string) => {
    try {
      await rejectDoctor(id).unwrap();
      alert("Doctor account marked as Inactive.");
      refetch();
    } catch (err: any) {
      alert(err?.data?.message || "Failed to reject doctor account.");
    }
  };

  const handleSuspend = async (id: string) => {
    try {
      await suspendUser(id).unwrap();
      alert("User account suspended successfully.");
      refetch();
    } catch (err: any) {
      alert(err?.data?.message || "Failed to suspend user account.");
    }
  };

  const doctors = allUsers.filter((u: any) => u.role === "DOCTOR");

  return (
    <AdminScreenLayout
      activeRoute="/admin/doctors"
      title="Doctors"
      onRefresh={refetch}
      refreshing={false}
    >
      {isLoading ? (
        <AppLoader />
      ) : (
        <View>
          <AppText weight="bold" variant="body" className="mb-3">
            Clinical Doctor Register
          </AppText>

          {doctors.length === 0 ? (
            <EmptyState message="No doctors found in the register." />
          ) : (
            doctors.map((u: any) => {
              const isPending = u.status === "PENDING_VERIFICATION";
              const isSuspended = u.status === "SUSPENDED";
              return (
                <AppCard style={{ marginBottom: 12, padding: 14 }} key={u.id}>
                  {/* DOCTOR NAME + STATUS BADGE */}
                  <View className="flex-row justify-between items-center mb-2">
                    <View>
                      <AppText weight="bold">
                        {u.profile?.fullName || "Dr. Consultant"}
                      </AppText>
                      <AppText variant="caption" color={mutedColor}>
                        {u.email}
                      </AppText>
                    </View>
                    <View
                      className="py-0.5 px-2 rounded"
                      style={{
                        backgroundColor: isPending
                          ? warningColor + "15"
                          : isSuspended
                            ? errorColor + "15"
                            : successColor + "15",
                      }}
                    >
                      <AppText
                        weight="bold"
                        variant="caption"
                        color={
                          isPending
                            ? warningColor
                            : isSuspended
                              ? errorColor
                              : successColor
                        }
                      >
                        {u.status}
                      </AppText>
                    </View>
                  </View>

                  {/* PHONE META */}
                  <AppText variant="caption" style={{ marginBottom: 8 }}>
                    Phone: {u.phoneNumber}
                  </AppText>

                  {/* ACTION BUTTONS */}
                  <View className="flex-row gap-2 mt-1">
                    {isPending && (
                      <>
                        <TouchableOpacity
                          onPress={() => handleApprove(u.id)}
                          className="bg-teal-700 py-1.5 px-3 rounded flex-1 items-center justify-center flex-row gap-1"
                        >
                          <UserCheck size={14} color="#FFF" />
                          <AppText
                            weight="bold"
                            style={{ fontSize: 12, color: "#FFF" }}
                          >
                            Approve
                          </AppText>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => handleReject(u.id)}
                          className="bg-red-500 py-1.5 px-3 rounded flex-1 items-center justify-center flex-row gap-1"
                        >
                          <XCircle size={14} color="#FFF" />
                          <AppText
                            weight="bold"
                            style={{ fontSize: 12, color: "#FFF" }}
                          >
                            Reject
                          </AppText>
                        </TouchableOpacity>
                      </>
                    )}
                    {!isPending && !isSuspended && (
                      <TouchableOpacity
                        onPress={() => handleSuspend(u.id)}
                        className="bg-amber-500 py-1.5 px-3 rounded flex-1 items-center justify-center flex-row gap-1"
                      >
                        <ShieldAlert size={14} color="#FFF" />
                        <AppText
                          weight="bold"
                          style={{ fontSize: 12, color: "#FFF" }}
                        >
                          Suspend Account
                        </AppText>
                      </TouchableOpacity>
                    )}
                  </View>
                </AppCard>
              );
            })
          )}
        </View>
      )}
    </AdminScreenLayout>
  );
};

export default AdminDoctors;
