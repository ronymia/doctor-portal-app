import Feather from "@expo/vector-icons/Feather";
import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";
import { ActivityIndicator, Text, View } from "react-native";

import AppButton from "@/src/components/common/AppButton";
import AppInput from "@/src/components/form/AppInput";
import { specializationSchema, TSpecializationFormFields } from "@/src/schemas";
import useCreateSpecializationMutation from "../hooks/mutations/useCreateSpecializationMutation";
import useUpdateSpecializationMutation from "../hooks/mutations/useUpdateSpecializationMutation";
import useGetSpecializationsQuery from "../hooks/queries/useGetSpecializationsQuery";

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

  // DERIVE VALUES FOR EDIT MODE
  const formValues =
    isEditMode && specToEdit
      ? {
          name: specToEdit.name || "",
          description: specToEdit.description || "",
        }
      : undefined;

  // FORM HANDLERS
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<TSpecializationFormFields>({
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
      } else {
        const response = await createSpecialization(fields).unwrap();
      }

      onSubmitSuccess();
    } catch (err: any) {
      console.log(err);
      setError("root.serverError", {
        type: "server",
        message:
          err?.data?.message ||
          err?.message ||
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
    <>
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

      {errors.root?.serverError?.message && (
        <Text className="text-red-500 mt-2 font-medium text-center">
          {errors.root.serverError.message}
        </Text>
      )}

      <View className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
        <AppButton
          title={isEditMode ? "Update Specialization" : "Create Specialization"}
          onPress={handleSubmit(onSubmit)}
          loading={isCreating || isUpdating}
          disabled={isCreating || isUpdating}
        />
      </View>
    </>
  );
}
