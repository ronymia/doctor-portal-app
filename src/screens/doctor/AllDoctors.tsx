import {
  Pencil,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  UserCheck,
  XCircle,
} from "lucide-react-native";
import { useState } from "react";
import { Image, TouchableOpacity, useColorScheme, View } from "react-native";

import AppButton from "@/src/components/common/AppButton";
import AppCard from "@/src/components/common/AppCard";
import AppLoader from "@/src/components/common/AppLoader";
import AppText from "@/src/components/common/AppText";
import ConfirmationModal from "@/src/components/common/ConfirmationModal";
import EmptyState from "@/src/components/common/EmptyState";
import { useModal } from "@/src/contexts/ModalContext";
import AdminScreenLayout from "@/src/screens/components/AdminScreenLayout";
import {
  useApproveDoctorMutation,
  useDeleteDoctorMutation,
  useGetUsersQuery,
  useRejectDoctorMutation,
  useSuspendUserMutation,
  useUnsuspendUserMutation,
} from "@/src/store/api";
import { COLORS } from "@/src/theme/theme";

// ADMIN DOCTORS — FULLY SELF-CONTAINED SCREEN
export default function AllDoctors() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? COLORS.dark : COLORS.light;

  // THEME COLOR PALETTE
  const successColor = isDark ? "#34D399" : "#10B981";
  const warningColor = isDark ? "#FBBF24" : "#F59E0B";
  const errorColor = isDark ? "#F87171" : "#EF4444";

  const {
    data: allUsersResponse,
    isLoading,
    refetch,
  } = useGetUsersQuery({ role: "DOCTOR" });
  const doctors = allUsersResponse?.data || [];

  const [approveDoctor] = useApproveDoctorMutation();
  const [rejectDoctor] = useRejectDoctorMutation();
  const [suspendUser] = useSuspendUserMutation();
  const [unsuspendUser] = useUnsuspendUserMutation();
  const [deleteDoctor] = useDeleteDoctorMutation();
  const { openModal } = useModal();

  const [modalConfig, setModalConfig] = useState<{
    visible: boolean;
    type: "success" | "danger" | "info" | "warning";
    actionType:
      | "APPROVE_CONFIRM"
      | "REJECT_CONFIRM"
      | "SUSPEND_CONFIRM"
      | "UNSUSPEND_CONFIRM"
      | "DELETE_CONFIRM"
      | "INFO";
    title: string;
    message: string;
    targetId?: string | null;
  }>({
    visible: false,
    type: "info",
    actionType: "INFO",
    title: "",
    message: "",
  });

  const confirmAction = (
    actionType:
      | "APPROVE_CONFIRM"
      | "REJECT_CONFIRM"
      | "SUSPEND_CONFIRM"
      | "UNSUSPEND_CONFIRM"
      | "DELETE_CONFIRM",
    id: string,
  ) => {
    let title = "";
    let message = "";
    let type: "success" | "danger" | "warning" = "info" as any;

    if (actionType === "APPROVE_CONFIRM") {
      title = "Approve Doctor";
      message = "Are you sure you want to approve this doctor's account?";
      type = "success";
    } else if (actionType === "REJECT_CONFIRM") {
      title = "Reject Doctor";
      message = "Are you sure you want to reject this doctor's account?";
      type = "danger";
    } else if (actionType === "SUSPEND_CONFIRM") {
      title = "Suspend Account";
      message = "Are you sure you want to suspend this user's account?";
      type = "warning";
    } else if (actionType === "UNSUSPEND_CONFIRM") {
      title = "Unsuspend Account";
      message =
        "Are you sure you want to lift the suspension for this user's account?";
      type = "success";
    } else if (actionType === "DELETE_CONFIRM") {
      title = "Delete Doctor";
      message =
        "Are you sure you want to permanently delete this doctor's account? This action cannot be undone.";
      type = "danger";
    }

    setModalConfig({
      visible: true,
      type,
      actionType,
      title,
      message,
      targetId: id,
    });
  };

  const executeAction = async () => {
    const { targetId, actionType } = modalConfig;
    if (!targetId) return;

    setModalConfig((prev) => ({ ...prev, visible: false }));
    try {
      if (actionType === "APPROVE_CONFIRM") {
        await approveDoctor(targetId).unwrap();
        setModalConfig({
          visible: true,
          type: "success",
          actionType: "INFO",
          title: "Approval Successful",
          message: "Doctor account approved successfully.",
        });
      } else if (actionType === "REJECT_CONFIRM") {
        await rejectDoctor(targetId).unwrap();
        setModalConfig({
          visible: true,
          type: "success",
          actionType: "INFO",
          title: "Rejection Successful",
          message: "Doctor account marked as Inactive.",
        });
      } else if (actionType === "SUSPEND_CONFIRM") {
        await suspendUser(targetId).unwrap();
        setModalConfig({
          visible: true,
          type: "success",
          actionType: "INFO",
          title: "Suspension Successful",
          message: "User account suspended successfully.",
        });
      } else if (actionType === "UNSUSPEND_CONFIRM") {
        await unsuspendUser(targetId).unwrap();
        setModalConfig({
          visible: true,
          type: "success",
          actionType: "INFO",
          title: "Unsuspension Successful",
          message: "User account unsuspended successfully.",
        });
      } else if (actionType === "DELETE_CONFIRM") {
        await deleteDoctor(targetId).unwrap();
        setModalConfig({
          visible: true,
          type: "success",
          actionType: "INFO",
          title: "Deletion Successful",
          message: "Doctor account deleted successfully.",
        });
      }
      refetch();
    } catch (err: any) {
      setModalConfig({
        visible: true,
        type: "danger",
        actionType: "INFO",
        title: "Error",
        message: err?.data?.message || "Failed to perform action.",
      });
    }
  };

  const handleModalConfirm = () => {
    if (modalConfig.actionType !== "INFO") {
      executeAction();
    } else {
      setModalConfig((prev) => ({ ...prev, visible: false }));
    }
  };

  const handleModalCancel = () => {
    setModalConfig((prev) => ({ ...prev, visible: false }));
  };

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
          <ConfirmationModal
            visible={modalConfig.visible}
            title={modalConfig.title}
            message={modalConfig.message}
            confirmText={modalConfig.actionType !== "INFO" ? "Confirm" : "OK"}
            cancelText={modalConfig.actionType !== "INFO" ? "Cancel" : ""}
            type={modalConfig.type}
            onConfirm={handleModalConfirm}
            onCancel={handleModalCancel}
          />

          <View
            className="flex-row justify-between items-center"
            style={{ marginBottom: 20 }}
          >
            <AppText weight="bold" variant="body">
              Clinical Doctor Register
            </AppText>
            <AppButton
              title="Create Doctor"
              onPress={() => openModal("CREATE_DOCTOR")}
              style={{
                height: 40,
                minHeight: 40,
                paddingHorizontal: 16,
                paddingBottom: 10,
              }}
            />
          </View>

          {doctors.length === 0 ? (
            <EmptyState message="No doctors found in the register." />
          ) : (
            doctors.map((u: any) => {
              const isPending = u.status === "PENDING_VERIFICATION";
              const isSuspended = u.status === "SUSPENDED";

              return (
                <AppCard style={{ marginBottom: 12, padding: 14 }} key={u.id}>
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center flex-1 mr-2">
                      {/* PLACEHOLDER AVATAR IMAGE */}
                      <View
                        style={{
                          width: 64,
                          height: 64,
                          borderRadius: 32,
                          overflow: "hidden",
                          marginRight: 14,
                          backgroundColor: isDark ? "#1E293B" : "#F1F5F9",
                          alignItems: "center",
                          justifyContent: "center",
                          borderWidth: 1,
                          borderColor: isDark ? "#334155" : "#E2E8F0",
                        }}
                      >
                        <Image
                          source={{
                            uri: `https://ui-avatars.com/api/?name=${encodeURIComponent(u.profile?.fullName || "Doctor")}&background=0F766E&color=fff&size=128`,
                          }}
                          style={{ width: "100%", height: "100%" }}
                        />
                      </View>

                      <View style={{ flex: 1 }}>
                        <AppText weight="bold" style={{ fontSize: 16 }}>
                          {u.profile?.fullName || "Dr. Consultant"}
                        </AppText>
                        <AppText
                          variant="caption"
                          style={{ color: theme.textSecondary, marginTop: 2 }}
                        >
                          {u.email}
                        </AppText>
                        <AppText
                          variant="caption"
                          style={{ color: theme.textMuted, marginTop: 4 }}
                        >
                          Phone: {u.phoneNumber}
                        </AppText>

                        <View
                          className="mt-2 self-start py-0.5 px-2 rounded"
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
                    </View>

                    <View className="flex-row gap-2">
                      {isPending && (
                        <>
                          <TouchableOpacity
                            onPress={() =>
                              confirmAction("APPROVE_CONFIRM", u.id)
                            }
                            className="w-9 h-9 rounded-full bg-teal-500/10 border border-teal-500/20 justify-center items-center"
                          >
                            <UserCheck size={16} color={successColor} />
                          </TouchableOpacity>

                          <TouchableOpacity
                            onPress={() =>
                              confirmAction("REJECT_CONFIRM", u.id)
                            }
                            className="w-9 h-9 rounded-full bg-red-500/10 border border-red-500/20 justify-center items-center"
                          >
                            <XCircle size={16} color={errorColor} />
                          </TouchableOpacity>
                        </>
                      )}
                      {!isPending && !isSuspended && (
                        <TouchableOpacity
                          onPress={() => confirmAction("SUSPEND_CONFIRM", u.id)}
                          className="w-9 h-9 rounded-full bg-amber-500/10 border border-amber-500/20 justify-center items-center"
                        >
                          <ShieldAlert size={16} color={warningColor} />
                        </TouchableOpacity>
                      )}

                      {isSuspended && (
                        <TouchableOpacity
                          onPress={() =>
                            confirmAction("UNSUSPEND_CONFIRM", u.id)
                          }
                          className="w-9 h-9 rounded-full bg-teal-500/10 border border-teal-500/20 justify-center items-center"
                        >
                          <ShieldCheck size={16} color={successColor} />
                        </TouchableOpacity>
                      )}

                      <TouchableOpacity
                        onPress={() =>
                          openModal("EDIT_DOCTOR", { doctorId: u.id })
                        }
                        className="w-9 h-9 rounded-full bg-teal-500/10 border border-teal-500/20 justify-center items-center"
                        style={{ marginLeft: 4 }}
                      >
                        <Pencil size={16} color={theme.primary} />
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => confirmAction("DELETE_CONFIRM", u.id)}
                        className="w-9 h-9 rounded-full bg-red-500/10 border border-red-500/20 justify-center items-center"
                        style={{ marginLeft: 4 }}
                      >
                        <Trash2 size={16} color={errorColor} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </AppCard>
              );
            })
          )}
        </View>
      )}
    </AdminScreenLayout>
  );
}
