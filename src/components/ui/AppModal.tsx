import React from 'react';
import {
  Modal as RNModal,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useColorScheme,
} from 'react-native';
import { X } from 'lucide-react-native';
import AppText from '../common/AppText';

interface AppModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const AppModal: React.FC<AppModalProps> = ({
  visible,
  onClose,
  title,
  children,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const surfaceBg = isDark ? '#151D30' : '#FFFFFF';
  const borderColor = isDark ? '#222F4C' : '#E2E8F0';
  const closeIconColor = isDark ? '#94A3B8' : '#475569';

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        className="flex-1 bg-black/50 justify-center items-center px-5"
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableWithoutFeedback>
          <View
            className="w-full rounded-2xl max-h-[80%] overflow-hidden shadow-2xl"
            style={{ backgroundColor: surfaceBg }}
          >
            {/* Header */}
            <View
              className="flex-row items-center justify-between p-4 border-b"
              style={{ borderBottomColor: borderColor }}
            >
              <AppText weight="bold" style={{ fontSize: 16 }}>
                {title || ''}
              </AppText>
              <TouchableOpacity onPress={onClose} className="p-1">
                <X size={20} color={closeIconColor} />
              </TouchableOpacity>
            </View>

            {/* Content */}
            <View className="p-4">{children}</View>
          </View>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </RNModal>
  );
};

export default AppModal;
