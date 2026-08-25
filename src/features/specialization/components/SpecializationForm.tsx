import Feather from '@expo/vector-icons/Feather';
import { zodResolver } from "@hookform/resolvers/zod";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { ActivityIndicator, View } from "react-native";

import AppButton from "@/src/components/common/AppButton";
import ConfirmationModal from "@/src/components/common/ConfirmationModal";
import AppInput from "@/src/components/form/AppInput";
import { specializationSchema, TSpecializationFormFields } from "@/src/schemas";
import {
  useCreateSpecializationMutation,
  useGetSpecializationsQuery,
  useUpdateSpecializationMutation,
} from "@/src/store/api";

interface ISpecializationFormProps {
  readonly specializationId?: string;
  readonly onSubmitSuccess: () => void;
}

export default function SpecializationForm({
  specializationId,
  onSubmitSuccess,
}: ISpecializationFormProps) {
  const isEditMode = !!specializationId;

  // QUERIES & MUTATIONS
  const { data: specsResponse, isLoading: isFetching } =
    useGetSpecializationsQuery({}, { skip: !isEditMode });

  const [createSpecialization, { isLoading: isCreating }] =
    useCreateSpecializationMutation();
  const [updateSpecialization, { isLoading: isUpdating }] =
    useUpdateSpecializationMutation();

  const specToEdit = isEditMode
    ? (specsResponse?.data || []).find((s: any) => s.id === specializationId)
    : null;

  // MODAL STATE
  const [modalConfig, setModalConfig] = useState<{
    visible: boolean;
    type: "success" | "danger";
    title: string;
    message: string;
  }>({
    visible: false,
    type: "success",
    title: "",
    message: "",
  });

  const handleModalClose = () => {
    setModalConfig((prev) => ({ ...prev, visible: false }));
    if (modalConfig.type === "success") {
      onSubmitSuccess();
    }
  };

  // DERIVE VALUES FOR EDIT MODE
  const formValues =
    isEditMode && specToEdit
      ? {
          name: specToEdit.name || "",
          description: specToEdit.description || "",
        }
      : undefined;

  // FORM HANDLERS
  const { control, handleSubmit } = useForm<TSpecializationFormFields>({
    resolver: zodResolver(specializationSchema),
    values: formValues as any,
    defaultValues: {
      name: "",
      description: "",
    },
  });

  // HANDLE SUBMIT
  const onSubmit = async (fields: TSpecializationFormFields) => {
    try {
      if (isEditMode) {
        const response = await updateSpecialization({
          id: specializationId,
          ...fields,
        }).unwrap();
        if (response && response.success) {
          setModalConfig({
            visible: true,
            type: "success",
            title: "Update Successful",
            message: "Specialization updated successfully!",
          });
        }
      } else {
        const response = await createSpecialization(fields).unwrap();
        if (response && response.success) {
          setModalConfig({
            visible: true,
            type: "success",
            title: "Creation Successful",
            message: "Specialization created successfully!",
          });
        }
      }
    } catch (err: any) {
      setModalConfig({
        visible: true,
        type: "danger",
        title: "Error",
        message:
          err?.data?.message ||
          `Failed to ${isEditMode ? "update" : "create"} specialization.`,
      });
    }
  };

  // SHOW LOADER WHILE FETCHING DATA IN EDIT MODE
  if (isEditMode && isFetching) {
    return (
      <View className="py-10 items-center">
        <ActivityIndicator size="large" color="#14B8A6" />
      </View>
    );
  }

  return (
    <View className="flex-1">
      <ConfirmationModal
        visible={modalConfig.visible}
        title={modalConfig.title}
        message={modalConfig.message}
        confirmText="OK"
        cancelText={modalConfig.type === "success" ? "cancel" : ""}
        type={modalConfig.type}
        onConfirm={handleModalClose}
        onCancel={handleModalClose}
      />

      <View className="py-2">
        <AppInput
          name="name"
          control={control}
          label="Name"
          placeholder="Cardiology"
          icon={<Feather name="book" size={18} color="#94A3B8" />}
        />
        <AppInput
          name="description"
          control={control}
          label="Description"
          placeholder="Heart related issues"
          icon={<Feather name="file-text" size={18} color="#94A3B8" />}
        />
      </View>

      <View className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
        <AppButton
          title={isEditMode ? "Update Specialization" : "Create Specialization"}
          onPress={handleSubmit(onSubmit)}
          loading={isCreating || isUpdating}
          disabled={isCreating || isUpdating}
        />
      </View>
    </View>
  );
}
