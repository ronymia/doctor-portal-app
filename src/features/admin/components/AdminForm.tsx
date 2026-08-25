import { createAdminSchema, updateAdminSchema } from "@/src/schemas";
import { TAdminFormFields } from "@/src/types";
import { zodResolver } from "@hookform/resolvers/zod";
import Feather from "@expo/vector-icons/Feather";

import { useForm } from "react-hook-form";
import { ActivityIndicator, View } from "react-native";

import AppButton from "@/src/components/common/AppButton";
import AppDateInput from "@/src/components/form/AppDateInput";
import AppInput from "@/src/components/form/AppInput";
import AppPasswordInput from "@/src/components/form/AppPasswordInput";
import AppPhoneInput from "@/src/components/form/AppPhoneInput";
import AppRadio from "@/src/components/form/AppRadio";
import useAppModal from "@/src/hooks/useAppModal";
import {
  useCreateAdminMutation,
  useGetAdminsQuery,
  useUpdateAdminMutation,
} from "@/src/store/api";

// interface IAdminFormProps {
//   readonly adminId?: string;
//   readonly onSubmitSuccess: () => void;
// }

export default function AdminForm() {
  const { modalConfig, setModalConfig, openModal, closeModal } = useAppModal();
  const adminId = (modalConfig?.data as any)?.id;
  const isEditMode = !!adminId;

  // QUERIES & MUTATIONS
  const { data: adminsResponse, isLoading: isFetching } = useGetAdminsQuery(
    {},
    { skip: !isEditMode },
  );
  const [createAdmin, { isLoading: isCreating }] = useCreateAdminMutation();
  const [updateAdmin, { isLoading: isUpdating }] = useUpdateAdminMutation();

  const adminToEdit = isEditMode
    ? (adminsResponse?.data || []).find((adm: any) => adm.id === adminId)
    : null;

  // MODAL STATE
  // const [modalConfig, setModalConfig] = useState<{
  //   visible: boolean;
  //   type: "success" | "danger";
  //   title: string;
  //   message: string;
  // }>({
  //   visible: false,
  //   type: "success",
  //   title: "",
  //   message: "",
  // });

  const handleModalClose = () => {
    setModalConfig((prev) => ({ ...prev, visible: false }));
  };

  // DERIVE VALUES FOR EDIT MODE
  const formValues =
    isEditMode && adminToEdit
      ? {
          email: adminToEdit.user?.email || "",
          phoneNumber: adminToEdit.user?.phoneNumber?.replace("+880", "") || "",
          password: "",
          profile: {
            fullName: adminToEdit.user?.profile?.fullName || "",
            address: adminToEdit.user?.profile?.address || "",
            dateOfBirth: adminToEdit.user?.profile?.dateOfBirth || "",
            joiningDate: adminToEdit.user?.profile?.joiningDate || "",
            gender: adminToEdit.user?.profile?.gender || "MALE",
          },
        }
      : undefined;

  // FORM HANDLERS
  const { control, handleSubmit } = useForm<TAdminFormFields>({
    resolver: zodResolver(
      isEditMode ? updateAdminSchema : createAdminSchema,
    ) as any,
    values: formValues, // Replaces the useEffect! RHF handles deep equality checks automatically.
    defaultValues: {
      email: "",
      phoneNumber: "",
      password: "",
      profile: {
        fullName: "",
        address: "",
        dateOfBirth: "",
        joiningDate: "",
        gender: "MALE",
      },
    },
  });

  // HANDLE SUBMIT
  const onSubmit = async (fields: TAdminFormFields) => {
    try {
      if (isEditMode) {
        const updatePayload = {
          phoneNumber: fields.phoneNumber
            ? `+880${fields.phoneNumber}`
            : undefined,
          email: fields.email,
          profile: fields.profile,
        };
        const response = await updateAdmin({
          id: adminId,
          ...updatePayload,
        }).unwrap();
        // if (response && response.success) {
        //   setModalConfig({
        //     visible: true,
        //     type: "success",
        //     title: "Update Successful",
        //     message: "Admin updated successfully!",
        //   });
        // }
      } else {
        const createPayload = {
          email: fields.email,
          phoneNumber: fields.phoneNumber ? `+880${fields.phoneNumber}` : "",
          password: fields.password,
          profile: {
            ...fields.profile,
            profilePicture: "default.png",
          },
        };
        const formData = new FormData();
        formData.append("data", JSON.stringify(createPayload));

        const response = await createAdmin(formData).unwrap();
        // if (response && response.success) {
        //   setModalConfig({
        //     visible: true,
        //     type: "success",
        //     title: "Creation Successful",
        //     message: "Admin created successfully!",
        //   });
        // }
      }
    } catch (err: any) {
      console.log(err);
      //   setModalConfig({
      //     visible: true,
      //     type: "danger",
      //     title: "Error",
      //     message:
      //       err?.data?.message ||
      //       `Failed to ${isEditMode ? "update" : "create"} admin.`,
      //   });
    }
  };

  // SHOW LOADER WHILE FETCHING ADMIN DATA IN EDIT MODE
  if (isEditMode && isFetching) {
    return (
      <View className="py-10 items-center">
        <ActivityIndicator size="large" color="#14B8A6" />
      </View>
    );
  }

  return (
    <>
      {/* <ConfirmationModal
        visible={modalConfig.visible}
        title={modalConfig.title}
        message={modalConfig.message}
        confirmText="OK"
        cancelText={modalConfig.type === "success" ? "cancel" : ""}
        type={modalConfig.type}
        onConfirm={handleModalClose}
        onCancel={handleModalClose}
      /> */}

      <View className="py-2">
        <AppInput
          name="profile.fullName"
          control={control}
          label="Full Name"
          placeholder="Jane Doe"
          icon={<Feather name="user" size={18} color="#94A3B8" />}
        />
        <AppInput
          name="email"
          control={control}
          label="Email Address"
          placeholder="admin@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
          icon={<Feather name="mail" size={18} color="#94A3B8" />}
        />
        <AppPhoneInput
          name="phoneNumber"
          control={control}
          label="Phone Number"
        />
        {!isEditMode && (
          <AppPasswordInput
            name="password"
            control={control}
            label="Password"
            placeholder="••••••••"
          />
        )}
        <AppRadio
          name="profile.gender"
          control={control}
          label="Gender"
          horizontal
          options={[
            { label: "Male", value: "MALE" },
            { label: "Female", value: "FEMALE" },
            { label: "Other", value: "OTHER" },
          ]}
        />
        <AppInput
          name="profile.address"
          control={control}
          label="Address"
          placeholder="123 Main St"
          icon={<Feather name="map-pin" size={18} color="#94A3B8" />}
        />
        <AppDateInput
          name="profile.dateOfBirth"
          control={control}
          label="Date of Birth"
          placeholder="Select Date of Birth"
        />
        <AppDateInput
          name="profile.joiningDate"
          control={control}
          label="Joining Date"
          placeholder="Select Joining Date"
        />
        <AppButton
          title={isEditMode ? "Update Admin" : "Create Admin"}
          onPress={handleSubmit(onSubmit)}
          loading={isCreating || isUpdating}
          style={{ marginTop: 24, width: "100%" }}
        />
      </View>
    </>
  );
}
