import { useTheme } from "@/src/hooks/useTheme";
import { LogOut, ShieldCheck } from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import {
  Animated,
  Dimensions,
  Modal,
  Platform,
  StatusBar,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import AppText from "@/src/components/common/AppText";
import { ADMIN_MENU_ITEMS, TAdminRoute } from "@/src/constants";
import { useAppSelector } from "@/src/store/hooks";
import { hasPermission } from "@/src/utils/permission.util";

interface IAdminSidebarProps {
  visible: boolean;
  /** The current route path, used to highlight the active item */
  activeRoute: TAdminRoute;
  isSuperAdmin: boolean;
  pendingDoctorsCount: number;
  userName: string;
  onNavigate: (route: TAdminRoute) => void;
  onLogout: () => void;
  onClose: () => void;
}

const SIDEBAR_WIDTH = Dimensions.get("window").width * 0.75;

export default function AdminSidebar({
  visible,
  activeRoute,
  isSuperAdmin,
  pendingDoctorsCount,
  userName,
  onNavigate,
  onLogout,
  onClose,
}: IAdminSidebarProps) {
  const { colors } = useTheme();
  const { user } = useAppSelector((state) => state.auth);

  // WE STILL NEED SOME HEX COLORS FOR LUCIDE ICONS (THEY DON'T SUPPORT TAILWIND CLASSES)
  const primaryColor = colors.primary;
  const mutedColor = colors.textMuted;
  const errorColor = colors.error;

  // ANIMATED SLIDE VALUE — starts fully off-screen to the left
  const [slideAnim] = useState(() => new Animated.Value(-SIDEBAR_WIDTH));

  useEffect(() => {
    // ANIMATE SIDEBAR IN OR OUT BASED ON VISIBILITY
    Animated.spring(slideAnim, {
      toValue: visible ? 0 : -SIDEBAR_WIDTH,
      useNativeDriver: true,
      speed: 20,
      bounciness: 2,
    }).start();
  }, [visible, slideAnim]);

  const handleItemPress = (route: TAdminRoute) => {
    onClose();
    // NAVIGATE TO THE SELECTED ADMIN ROUTE
    onNavigate(route);
  };

  const userPermissions = user?.permissions || [];

  const visibleMenuItems = useMemo(
    () =>
      ADMIN_MENU_ITEMS.filter((item) =>
        hasPermission(
          userPermissions,
          item.requiredPermission,
          isSuperAdmin,
          item.requireAllPermissions,
        ),
      ),
    [isSuperAdmin, userPermissions],
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      {/* BACKDROP — tap to dismiss */}
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="absolute inset-0 bg-black/50 dark:bg-black/70" />
      </TouchableWithoutFeedback>

      {/* SIDEBAR PANEL */}
      <Animated.View
        className="absolute top-0 left-0 bottom-0 bg-white dark:bg-slate-900 shadow-black/30"
        style={{
          width: SIDEBAR_WIDTH,
          transform: [{ translateX: slideAnim }],
          shadowOffset: { width: 4, height: 0 },
          shadowOpacity: 0.3,
          shadowRadius: 12,
          elevation: 20,
          paddingTop:
            Platform.OS === "android" ? (StatusBar.currentHeight ?? 0) : 0,
        }}
      >
        {/* USER PROFILE HEADER */}
        <View className="bg-teal-50 dark:bg-[#0B0F19] p-5 pt-7 border-b border-slate-200 dark:border-slate-800">
          {/* AVATAR CIRCLE */}
          <View className="w-[52px] h-[52px] rounded-full bg-teal-100 dark:bg-teal-800 justify-center items-center mb-2.5">
            <ShieldCheck size={26} color={primaryColor} />
          </View>
          <AppText
            weight="bold"
            className="text-base text-slate-900 dark:text-slate-50"
          >
            {user?.profile?.fullName || userName}
          </AppText>
          <AppText
            variant="caption"
            className="text-teal-700 dark:text-teal-400 mt-0.5 font-semibold"
          >
            {isSuperAdmin ? "Super Admin" : "Administrator"}
          </AppText>
        </View>

        {/* NAV MENU ITEMS */}
        <View className="flex-1 py-3">
          {visibleMenuItems.map((item) => {
            const isActive = activeRoute === item.route;
            const hasBadge =
              item.route === "/admin/doctors" && pendingDoctorsCount > 0;

            return (
              <TouchableOpacity
                key={item.route}
                onPress={() => handleItemPress(item.route)}
                className={`flex-row items-center py-3.5 px-5 mb-0.5 ${
                  isActive
                    ? "bg-teal-100 dark:bg-teal-800 border-r-[3px] border-teal-700 dark:border-teal-400"
                    : "bg-transparent border-r-0"
                }`}
                activeOpacity={0.7}
              >
                {/* ICON BOX */}
                <View
                  className={`w-9 h-9 rounded-lg justify-center items-center mr-3 ${
                    isActive
                      ? "bg-teal-700/20 dark:bg-teal-400/20"
                      : "bg-slate-50 dark:bg-slate-800"
                  }`}
                >
                  <item.Icon
                    size={18}
                    color={isActive ? primaryColor : mutedColor}
                  />
                </View>

                {/* LABEL */}
                <AppText
                  weight={isActive ? "bold" : "medium"}
                  className={`flex-1 text-sm ${
                    isActive
                      ? "text-teal-700 dark:text-teal-400"
                      : "text-slate-900 dark:text-slate-50"
                  }`}
                >
                  {item.label}
                </AppText>

                {/* PENDING DOCTORS BADGE */}
                {hasBadge && (
                  <View className="bg-amber-500 rounded-full px-2 py-0.5 min-w-[22px] items-center">
                    <AppText className="text-white text-[11px] font-bold">
                      {pendingDoctorsCount}
                    </AppText>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* DIVIDER + LOGOUT */}
        <View className="border-t border-slate-200 dark:border-slate-800 p-4 pb-7">
          <TouchableOpacity
            onPress={onLogout}
            className="flex-row items-center py-3 px-4 rounded-lg bg-red-500/10 dark:bg-red-400/10"
            activeOpacity={0.7}
          >
            <LogOut size={18} color={errorColor} style={{ marginRight: 12 }} />
            <AppText
              weight="semibold"
              className="text-red-500 dark:text-red-400 text-sm"
            >
              Logout
            </AppText>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Modal>
  );
}
