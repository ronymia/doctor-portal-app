
import Feather from '@expo/vector-icons/Feather';
import { useState } from "react";
import { TouchableOpacity, View } from "react-native";

import AppButton from "@/src/components/common/AppButton";
import AppCard from "@/src/components/common/AppCard";
import AppLoader from "@/src/components/common/AppLoader";
import AppText from "@/src/components/common/AppText";
import ConfirmationModal from "@/src/components/common/ConfirmationModal";
import EmptyState from "@/src/components/common/EmptyState";
import AppModal from "@/src/components/ui/AppModal";
import { useTheme } from "@/src/hooks/useTheme";
import useDeleteSpecializationMutation from "../hooks/mutations/useDeleteSpecializationMutation";
import useGetSpecializationsQuery from "../hooks/queries/useGetSpecializationsQuery";
import AdminScreenLayout from "../../../layouts/AdminScreenLayout";
import SpecializationForm from "../components/SpecializationForm";

export default function AllSpecialization() {
  const { theme, isDark } = useTheme();

  const {
    data: specResponse,
    isLoading,
    refetch,
  } = useGetSpecializationsQuery({});
  const specializations = specResponse?.data || [];

  const [deleteSpecialization] = useDeleteSpecializationMutation();

  // MODAL STATE
  const [modalConfig, setModalConfig] = useState<{
    visible: boolean;
    type: "success" | "danger" | "warning";
    title: string;
    message: string;
    actionType: "DELETE" | "INFO" | "CREATE_EDIT" | null;
    selectedId: string | null;
  }>({
    visible: false,
    type: "success",
    title: "",
    message: "",
    actionType: null,
    selectedId: null,
  });

  const confirmAction = (action: "DELETE", id: string) => {
    setModalConfig({
      visible: true,
      type: "danger",
      actionType: action,
      title: "Delete Specialization",
      message: "Are you sure you want to delete this specialization?",
      selectedId: id,
    });
  };

  const executeAction = async () => {
    try {
      if (modalConfig.actionType === "DELETE" && modalConfig.selectedId) {
        await deleteSpecialization(modalConfig.selectedId).unwrap();
        setModalConfig({
          visible: true,
          type: "success",
          actionType: "INFO",
          title: "Success",
          message: "Specialization deleted successfully.",
          selectedId: null,
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
        selectedId: null,
      });
    }
  };

  const handleModalConfirm = () => {
    if (
      modalConfig.actionType !== "INFO" &&
      modalConfig.actionType !== "CREATE_EDIT"
    ) {
      executeAction();
    } else {
      setModalConfig((prev) => ({ ...prev, visible: false }));
    }
  };

  const handleModalCancel = () => {
    setModalConfig((prev) => ({ ...prev, visible: false }));
  };

  // FORM MODAL
  const openFormModal = (id?: string) => {
    setModalConfig({
      visible: true,
      type: "success",
      actionType: "CREATE_EDIT",
      title: id ? "Edit Specialization" : "Create Specialization",
      message: "",
      selectedId: id || null,
    });
  };

  return (
    <AdminScreenLayout
      activeRoute="/admin/specialization"
      title="Specializations"
      onRefresh={refetch}
      refreshing={false}
    >
      {isLoading ? (
        <AppLoader />
      ) : (
        <View>
          <ConfirmationModal
            visible={
              modalConfig.visible && modalConfig.actionType !== "CREATE_EDIT"
            }
            title={modalConfig.title}
            message={modalConfig.message}
            confirmText={modalConfig.actionType !== "INFO" ? "Confirm" : "OK"}
            cancelText={modalConfig.actionType !== "INFO" ? "Cancel" : ""}
            type={modalConfig.type}
            onConfirm={handleModalConfirm}
            onCancel={handleModalCancel}
          />

          <AppModal
            visible={
              modalConfig.visible && modalConfig.actionType === "CREATE_EDIT"
            }
            onClose={handleModalCancel}
            title={modalConfig.title}
          >
            <SpecializationForm
              specializationId={modalConfig.selectedId || undefined}
              onSubmitSuccess={() => {
                setModalConfig((prev) => ({ ...prev, visible: false }));
                refetch();
              }}
            />
          </AppModal>

          <View
            className="flex-row justify-between items-center"
            style={{ marginBottom: 20 }}
          >
            <AppText weight="bold" variant="body">
              Clinical Specializations
            </AppText>
            <AppButton
              title="Create Specialization"
              onPress={() => openFormModal()}
              style={{
                height: 40,
                minHeight: 40,
                paddingHorizontal: 16,
                paddingBottom: 10,
              }}
            />
          </View>

          {specializations.length === 0 ? (
            <EmptyState message="No specializations found." />
          ) : (
            specializations.map((spec: any) => (
              <AppCard style={{ marginBottom: 12, padding: 14 }} key={spec.id}>
                <View className="flex-row items-center justify-between">
                  <View style={{ flex: 1 }}>
                    <AppText weight="bold" style={{ fontSize: 16 }}>
                      {spec.name}
                    </AppText>
                    <AppText
                      variant="caption"
                      style={{ color: theme.textSecondary, marginTop: 4 }}
                    >
                      {spec.description}
                    </AppText>
                  </View>

                  <View className="flex-row gap-2">
                    <TouchableOpacity
                      onPress={() => openFormModal(spec.id)}
                      style={{
                        padding: 8,
                        backgroundColor: isDark ? "#334155" : "#E2E8F0",
                        borderRadius: 6,
                      }}
                    >
                      <Feather name="edit" size={16} color={theme.text} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => confirmAction("DELETE", spec.id)}
                      style={{
                        padding: 8,
                        backgroundColor: isDark ? "#7F1D1D" : "#FEE2E2",
                        borderRadius: 6,
                      }}
                    >
                      <Feather name="trash-2"
                        size={16}
                        color={isDark ? "#FCA5A5" : "#EF4444"}
                      />
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
