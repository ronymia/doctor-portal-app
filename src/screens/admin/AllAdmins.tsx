import { router } from "expo-router";
import { Pencil, Trash } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Image, TouchableOpacity, useColorScheme, View } from "react-native";

import ConfirmationModal from "@/src/components/common/ConfirmationModal";

import AppButton from "@/src/components/common/AppButton";
import AppCard from "@/src/components/common/AppCard";
import AppLoader from "@/src/components/common/AppLoader";
import AppText from "@/src/components/common/AppText";
import EmptyState from "@/src/components/common/EmptyState";
import { useModal } from "@/src/contexts/ModalContext";
import { useAdminScreen } from "@/src/hooks/useAdminScreen";
import AdminScreenLayout from "@/src/screens/components/AdminScreenLayout";
import {
  useDeleteAdminMutation,
  useGetAdminsQuery,
} from "@/src/store/api/adminApi";
import { COLORS } from "@/src/theme/theme";

// ADMIN ADMINS — FULLY SELF-CONTAINED SCREEN (SUPER ADMIN ONLY)
export default function AllAdmins() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? COLORS.dark : COLORS.light;

  const { isSuperAdmin } = useAdminScreen();
  const { openModal } = useModal();

  // GUARD — REDIRECT NON-SUPER-ADMINS BACK TO OVERVIEW
  useEffect(() => {
    if (!isSuperAdmin) {
      router.replace("/admin" as any);
    }
  }, [isSuperAdmin]);

  const {
    data: adminsResponse,
    isLoading,
    refetch,
  } = useGetAdminsQuery({}, { skip: !isSuperAdmin });
  const allAdmins = adminsResponse?.data || [];

  const [deleteAdmin] = useDeleteAdminMutation();

  const [modalConfig, setModalConfig] = useState<{
    visible: boolean;
    type: "success" | "danger";
    actionType: "DELETE_CONFIRM" | "INFO";
    title: string;
    message: string;
    targetId?: string | null;
  }>({
    visible: false,
    type: "info" as any,
    actionType: "INFO",
    title: "",
    message: "",
  });

  const confirmDelete = (id: string) => {
    setModalConfig({
      visible: true,
      type: "danger",
      actionType: "DELETE_CONFIRM",
      title: "Confirm Delete",
      message:
        "Are you sure you want to delete this administrator? This action cannot be undone.",
      targetId: id,
    });
  };

  const executeDelete = async () => {
    const targetId = modalConfig.targetId;
    if (!targetId) return;

    setModalConfig((prev) => ({ ...prev, visible: false }));
    try {
      await deleteAdmin(targetId).unwrap();
      setModalConfig({
        visible: true,
        type: "success",
        actionType: "INFO",
        title: "Deletion Successful",
        message: "Admin deleted successfully.",
      });
      refetch();
    } catch (err: any) {
      setModalConfig({
        visible: true,
        type: "danger",
        actionType: "INFO",
        title: "Error",
        message: err?.data?.message || "Failed to delete admin.",
      });
    }
  };

  const handleModalConfirm = () => {
    if (modalConfig.actionType === "DELETE_CONFIRM") {
      executeDelete();
    } else {
      setModalConfig((prev) => ({ ...prev, visible: false }));
    }
  };

  const handleModalCancel = () => {
    setModalConfig((prev) => ({ ...prev, visible: false }));
  };

  if (!isSuperAdmin) return null;

  return (
    <AdminScreenLayout
      activeRoute="/admin/admins"
      title="Administrators"
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
            confirmText={
              modalConfig.actionType === "DELETE_CONFIRM" ? "Delete" : "OK"
            }
            cancelText={
              modalConfig.actionType === "DELETE_CONFIRM" ? "Cancel" : ""
            }
            type={modalConfig.type}
            onConfirm={handleModalConfirm}
            onCancel={handleModalCancel}
          />

          <View
            className="flex-row justify-between items-center"
            style={{ marginBottom: 20 }}
          >
            <AppText weight="bold" variant="body">
              System Administrators
            </AppText>
            {isSuperAdmin && (
              <AppButton
                title="Create Admin"
                onPress={() => openModal("CREATE_ADMIN")}
                style={{
                  height: 40,
                  minHeight: 40,
                  paddingHorizontal: 16,
                  paddingBottom: 10,
                }}
              />
            )}
          </View>

          {allAdmins.length === 0 ? (
            <EmptyState message="No admins found in the register." />
          ) : (
            allAdmins.map((adm: any) => (
              <AppCard style={{ marginBottom: 12, padding: 14 }} key={adm.id}>
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
                          uri: `https://ui-avatars.com/api/?name=${encodeURIComponent(adm.user?.profile?.fullName || "Admin")}&background=0F766E&color=fff&size=128`,
                        }}
                        style={{ width: "100%", height: "100%" }}
                      />
                    </View>

                    <View style={{ flex: 1 }}>
                      <AppText weight="bold" style={{ fontSize: 16 }}>
                        {adm.user?.profile?.fullName || "Admin Account"}
                      </AppText>
                      <AppText
                        variant="caption"
                        style={{ color: theme.textSecondary, marginTop: 2 }}
                      >
                        {adm.user?.email}
                      </AppText>
                      <AppText
                        variant="caption"
                        style={{ color: theme.textMuted, marginTop: 4 }}
                      >
                        Admin ID: {adm.adminId}
                      </AppText>
                    </View>
                  </View>

                  <View className="flex-row gap-2">
                    {/* EDIT ADMIN BUTTON */}
                    <TouchableOpacity
                      onPress={() =>
                        openModal("EDIT_ADMIN", { adminId: adm.id })
                      }
                      className="w-9 h-9 rounded-full bg-teal-500/10 border border-teal-500/20 justify-center items-center"
                    >
                      <Pencil size={16} color={theme.primary} />
                    </TouchableOpacity>

                    {/* DELETE ADMIN BUTTON */}
                    <TouchableOpacity
                      onPress={() => confirmDelete(adm.id)}
                      className="w-9 h-9 rounded-full bg-red-500/10 border border-red-500/20 justify-center items-center"
                    >
                      <Trash size={16} color={theme.error} />
                    </TouchableOpacity>
                  </View>
                </View>
              </AppCard>
            ))
          )}
        </View>
      )}
    </AdminScreenLayout>
  );
}
