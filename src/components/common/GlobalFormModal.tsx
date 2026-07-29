import { X } from "lucide-react-native";
import {
  Modal,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useColorScheme,
  View,
} from "react-native";

import AppText from "@/src/components/common/AppText";
import { useModal } from "@/src/contexts/ModalContext";
import AdminForm from "@/src/screens/admin/AdminForm";

export default function GlobalFormModal() {
  const { modalState, closeModal } = useModal();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  // COLORS
  const overlayColor = isDark ? "rgba(0,0,0,0.7)" : "rgba(0,0,0,0.5)";
  const cardBg = isDark ? "#1E293B" : "#FFFFFF";
  const textColor = isDark ? "#F8FAFC" : "#0F172A";
  const borderColor = isDark ? "#334155" : "#E2E8F0";

  // If the modal isn't open, render nothing
  if (!modalState.isOpen) return null;

  // DYNAMICALLY RENDER THE CORRECT FORM
  const renderFormContent = () => {
    switch (modalState.type) {
      case "TEST_MODAL":
        return (
          <View className="py-10 items-center">
            <AppText>This is a test form! Data passed:</AppText>
            <AppText
              weight="bold"
              className="mt-2 text-teal-600 dark:text-teal-400"
            >
              {JSON.stringify(modalState.data)}
            </AppText>
          </View>
        );
      case "CREATE_ADMIN":
        return <AdminForm onSubmitSuccess={closeModal} />;
      case "EDIT_ADMIN":
        return (
          <AdminForm
            adminId={modalState.data?.adminId}
            onSubmitSuccess={closeModal}
          />
        );
      // case "CREATE_DOCTOR":
      //   return <CreateDoctorForm data={modalState.data} onSubmitSuccess={closeModal} />;
      default:
        return (
          <AppText align="center" className="py-10">
            Unknown modal type: {modalState.type}
          </AppText>
        );
    }
  };

  const getModalTitle = () => {
    switch (modalState.type) {
      case "TEST_MODAL":
        return "Test Global Modal";
      case "CREATE_ADMIN":
        return "Create New Admin";
      case "EDIT_ADMIN":
        return "Edit Admin";
      case "CREATE_DOCTOR":
        return "Create New Doctor";
      case "EDIT_DOCTOR":
        return "Edit Doctor";
      default:
        return "Form";
    }
  };

  return (
    <Modal
      visible={modalState.isOpen}
      transparent
      animationType="slide"
      onRequestClose={closeModal}
      statusBarTranslucent
    >
      <View
        style={{
          flex: 1,
          backgroundColor: overlayColor,
          justifyContent: "flex-end", // Opens from bottom like a bottom sheet
        }}
      >
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={{ flex: 1 }} />
        </TouchableWithoutFeedback>

        {/* MODAL CARD */}
        <View
          style={{
            backgroundColor: cardBg,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            maxHeight: "90%",
            width: "100%",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -10 },
            shadowOpacity: 0.15,
            shadowRadius: 20,
            elevation: 10,
          }}
        >
          {/* HEADER */}
          <View
            className="flex-row items-center justify-between px-6 py-4 border-b"
            style={{ borderBottomColor: borderColor }}
          >
            <AppText weight="bold" style={{ fontSize: 18, color: textColor }}>
              {getModalTitle()}
            </AppText>

            <TouchableOpacity
              onPress={closeModal}
              style={{ padding: 4 }}
              hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
            >
              <X size={24} color={textColor} />
            </TouchableOpacity>
          </View>

          {/* SCROLLABLE CONTENT */}
          <ScrollView
            className="px-6 py-4"
            contentContainerStyle={{ paddingBottom: 40 }}
            keyboardShouldPersistTaps="handled"
          >
            {renderFormContent()}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
