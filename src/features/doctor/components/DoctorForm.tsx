import { zodResolver } from "@hookform/resolvers/zod";
import Feather from "@expo/vector-icons/Feather";

import { useForm } from "react-hook-form";
import { ActivityIndicator, View, Text } from "react-native";

import AppButton from "@/src/components/common/AppButton";
import AppDateInput from "@/src/components/form/AppDateInput";
import AppInput from "@/src/components/form/AppInput";
import AppPasswordInput from "@/src/components/form/AppPasswordInput";
import AppPhoneInput from "@/src/components/form/AppPhoneInput";
import AppRadio from "@/src/components/form/AppRadio";
import AppSelect from "@/src/components/form/AppSelect";
import useAppModal from "@/src/hooks/useAppModal";
import { doctorSchema, updateDoctorSchema } from "@/src/schemas";
import {
  useCreateDoctorMutation,
  useGetSpecializationsQuery,
  useGetUsersQuery,
  useUpdateDoctorMutation,
} from "@/src/store/api";

export default function DoctorForm() {
  const { closeModal, modalConfig, setModalConfig } = useAppModal();
  const doctorId = (modalConfig?.data as any)?.id;
  const isEditMode = !!doctorId;

  // QUERIES & MUTATIONS
  const { data: usersResponse, isLoading: isFetching } = useGetUsersQuery(
    { role: "DOCTOR" },
    { skip: !isEditMode },
  );
  const { data: specResponse } = useGetSpecializationsQuery({});
  const specializations = specResponse?.data || [];

  // MUTATIONS
  const [createDoctor, { isLoading: isCreating }] = useCreateDoctorMutation();
  const [updateDoctor, { isLoading: isUpdating }] = useUpdateDoctorMutation();

  const doctorToEdit = isEditMode
    ? (usersResponse?.data || []).find((u: any) => u.id === doctorId)
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
    isEditMode && doctorToEdit
      ? {
          email: doctorToEdit.email || "",
          phoneNumber: doctorToEdit.phoneNumber?.replace("+880", "") || "",
          password: "",
          doctor: {
            specializationId:
              doctorToEdit.doctor?.specializationId ||
              doctorToEdit.doctor?.specialization?.id ||
              "",
            qualification: doctorToEdit.doctor?.qualification || "",
          },
          profile: {
            fullName: doctorToEdit.profile?.fullName || "",
            address: doctorToEdit.profile?.address || "",
            gender: doctorToEdit.profile?.gender || "MALE",
            dateOfBirth: doctorToEdit.profile?.dateOfBirth || "",
            joiningDate: doctorToEdit.profile?.joiningDate || "",
          },
        }
      : undefined;

  // FORM HANDLERS
  const { control, handleSubmit, setError, formState: { errors } } = useForm<any>({
    resolver: zodResolver(isEditMode ? updateDoctorSchema : doctorSchema),
    values: formValues as any,
    defaultValues: {
      email: "",
      phoneNumber: "",
      password: "",
      doctor: {
        specializationId: "",
        qualification: "",
      },
      profile: {
        fullName: "",
        address: "",
        gender: "MALE",
        dateOfBirth: "",
        joiningDate: "",
      },
    },
  });
  // HANDLE SUBMIT
  const onSubmit = async (fields: any) => {
    try {
      if (isEditMode) {
        const updatePayload = {
          phoneNumber: fields.phoneNumber
            ? `+880${fields.phoneNumber}`
            : undefined,
          email: fields.email,
          profile: fields.profile,
          doctor: fields.doctor,
        };
        const response = await updateDoctor({
          id: doctorId,
          ...updatePayload,
        }).unwrap();

        // if (response?.success) {
        //   setModalConfig((prev) => ({
        //     ...prev,
        //     data: response?.data,
        //   }));
        // }
      } else {
        const createPayload = {
          email: fields.email,
          phoneNumber: fields.phoneNumber ? `+880${fields.phoneNumber}` : "",
          password: fields.password,
          doctor: fields.doctor,
          profile: {
            ...fields.profile,
            profilePicture: "default.png",
          },
        };
        const formData = new FormData();
        formData.append("data", JSON.stringify(createPayload));

        const response = await createDoctor(formData).unwrap();
      }
      
      closeModal();
    } catch (err: any) {
      console.log(err);
      setError("root.serverError", {
        type: "server",
        message: err?.data?.message || err?.message || `Failed to ${isEditMode ? "update" : "create"} doctor.`,
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
          placeholder="Dr. John Doe"
          icon={<Feather name="user" size={18} color="#94A3B8" />}
        />
        <AppInput
          name="email"
          control={control}
          label="Email Address"
          placeholder="doctor@email.com"
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
        <AppSelect
          name="doctor.specializationId"
          control={control}
          label="Specialization"
          placeholder="Select Specialization"
          options={specializations.map((spec: any) => ({
            label: spec.name,
            value: spec.id,
          }))}
        />
        <AppInput
          name="doctor.qualification"
          control={control}
          label="Qualification"
          placeholder="e.g. MBBS, FCPS"
          icon={<Feather name="briefcase" size={18} color="#94A3B8" />}
        />
        <AppInput
          name="profile.address"
          control={control}
          label="Address"
          placeholder="123 Clinic St"
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

        {errors.root?.serverError?.message && (
          <Text className="text-red-500 mt-2 font-medium text-center">
            {errors.root.serverError.message}
          </Text>
        )}

        <AppButton
          title={isEditMode ? "Update Doctor" : "Create Doctor"}
          onPress={handleSubmit(onSubmit)}
          loading={isCreating || isUpdating}
          style={{ marginTop: 24, width: "100%" }}
        />
      </View>
    </>
  );
}
