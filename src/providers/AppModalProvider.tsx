import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import AppText from "../components/common/AppText";
import AppModalContext, {
  IModalState,
  TModalType,
} from "../contexts/AppModalContext";
import AdminForm from "../features/admin/components/AdminForm";
import DoctorForm from "../features/doctor/components/DoctorForm";

export default function AppModalProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [modalConfig, setModalConfig] = useState<IModalState>({
    isOpen: false,
    type: null,
    data: null,
  });

  const openModal = (type: TModalType, data: unknown = null) => {
    setModalConfig({ isOpen: true, type, data });
  };

  const closeModal = (data: unknown): unknown | null => {
    setModalConfig({ isOpen: false, type: null, data: null });

    return data ?? null;
  };

  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  // COLORS
  const overlayColor = isDark ? "rgba(0,0,0,0.7)" : "rgba(0,0,0,0.5)";
  const cardBg = isDark ? "#1E293B" : "#FFFFFF";
  const textColor = isDark ? "#F8FAFC" : "#0F172A";
  const borderColor = isDark ? "#334155" : "#E2E8F0";

  // If the modal isn't open, we STILL need to render {children}!
  // The Modal component itself handles visibility via the 'visible' prop.

  // DYNAMICALLY RENDER THE CORRECT FORM
  const renderFormContent = () => {
    switch (modalConfig.type) {
      case "CREATE_ADMIN":
        return <AdminForm />;
      case "EDIT_ADMIN":
        return <AdminForm />;
      case "CREATE_DOCTOR":
        return <DoctorForm />;
      case "EDIT_DOCTOR":
        return <DoctorForm />;
      default:
        return (
          <AppText align="center" className="py-10">
            Unknown modal type: {modalConfig.type}
          </AppText>
        );
    }
  };

  const getModalTitle = () => {
    switch (modalConfig.type) {
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
    <AppModalContext.Provider
      value={{
        modalConfig,
        setModalConfig,
        openModal,
        closeModal: (data?: unknown) => closeModal(data),
      }}
    >
      {children}
      <Modal
        visible={modalConfig.isOpen}
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
          <Pressable style={{ flex: 1 }} onPress={closeModal} />

          {/* MODAL CARD */}
          <View
            style={{
              backgroundColor: cardBg,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              maxHeight: "90%",
              width: "100%",
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
                <Ionicons name="close" size={24} color={textColor} />
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
    </AppModalContext.Provider>
  );
}
