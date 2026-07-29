import React from "react";
import { Modal, TouchableWithoutFeedback, useColorScheme, View } from "react-native";
import { AlertCircle, AlertTriangle, CheckCircle, Info } from "lucide-react-native";

import AppButton from "./AppButton";
import AppText from "./AppText";

export type TConfirmationType = "info" | "warning" | "danger" | "success";

interface IConfirmationModalProps {
  visible: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  type?: TConfirmationType;
  loading?: boolean;
}

const ConfirmationModal: React.FC<IConfirmationModalProps> = ({
  visible,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "info",
  loading = false,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  // COLORS
  const overlayColor = isDark ? "rgba(0,0,0,0.7)" : "rgba(0,0,0,0.5)";
  const cardBg = isDark ? "#1E293B" : "#FFFFFF";
  const textColor = isDark ? "#F8FAFC" : "#0F172A";
  const mutedColor = isDark ? "#94A3B8" : "#64748B";

  const getIcon = () => {
    switch (type) {
      case "danger":
        return <AlertCircle size={32} color="#EF4444" />; // Red
      case "warning":
        return <AlertTriangle size={32} color="#F59E0B" />; // Yellow/Amber
      case "success":
        return <CheckCircle size={32} color="#10B981" />; // Green
      case "info":
      default:
        return <Info size={32} color={isDark ? "#38BDF8" : "#0284C7"} />; // Blue
    }
  };

  const getConfirmButtonVariant = (): "primary" | "secondary" | "outline" | "text" => {
    // We don't have a built-in danger variant in AppButton yet,
    // but primary will use the theme color. If we need a red button,
    // we could add a "danger" variant to AppButton later.
    // For now, primary works as the main action.
    return "primary";
  };

  // If it's a danger modal, we might want the confirm button to look destructive.
  // We can hack it with an inline style, or just rely on the AppButton defaults.
  const confirmButtonStyle = type === "danger" ? { backgroundColor: "#EF4444" } : {};

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
      statusBarTranslucent
    >
      {/* BACKDROP */}
      <TouchableWithoutFeedback onPress={onCancel} disabled={loading}>
        <View
          style={{
            flex: 1,
            backgroundColor: overlayColor,
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          <TouchableWithoutFeedback>
            {/* MODAL CARD */}
            <View
              style={{
                width: "100%",
                maxWidth: 400,
                backgroundColor: cardBg,
                borderRadius: 16,
                padding: 24,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.15,
                shadowRadius: 20,
                elevation: 10,
              }}
            >
              <View className="items-center mb-4">
                {getIcon()}
              </View>

              <AppText
                weight="bold"
                style={{ fontSize: 20, color: textColor, textAlign: "center", marginBottom: 8 }}
              >
                {title}
              </AppText>

              <AppText
                style={{ color: mutedColor, textAlign: "center", marginBottom: 24, lineHeight: 22 }}
              >
                {message}
              </AppText>

              <View className="flex-row justify-end gap-3">
                {cancelText ? (
                  <View className="flex-1">
                    <AppButton
                      title={cancelText}
                      onPress={onCancel}
                      variant="outline"
                      disabled={loading}
                      style={{ height: 44 }}
                    />
                  </View>
                ) : null}
                <View className="flex-1">
                  <AppButton
                    title={confirmText}
                    onPress={onConfirm}
                    variant={getConfirmButtonVariant()}
                    loading={loading}
                    style={{ height: 44, ...confirmButtonStyle }}
                  />
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default ConfirmationModal;
