import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Modal from "react-native-modal";

export interface IPremiumSelectionModalProps {
  isVisible: boolean;
  onClose: () => void;
  title?: string;
  data?: any[];
  labelField?: string;
  valueField?: string;
  selectedValue?: any;
  onSelect: (item: any) => void;
  placeholder?: string;
  singleSelect?: boolean;
}

const PremiumSelectionModal = ({
  isVisible,
  onClose,
  title,
  data = [],
  labelField = "name",
  valueField = "id",
  selectedValue,
  onSelect,
  placeholder = "Search...",
  singleSelect = true,
}: IPremiumSelectionModalProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredData = useMemo(() => {
    if (!searchQuery) return data;
    return data.filter((item) =>
      String(item[labelField])
        .toLowerCase()
        .includes(searchQuery.toLowerCase()),
    );
  }, [data, searchQuery, labelField]);

  const handleSelect = (item: any) => {
    if (singleSelect) {
      onSelect(item);
      onClose();
    } else {
      const isSelected = (selectedValue || [])?.some((val: any) => {
        const valId =
          typeof val === "object" && val !== null ? val[valueField] : val;
        return String(valId) === String(item[valueField]);
      });
      let newList;
      if (isSelected) {
        newList = (selectedValue || []).filter((val: any) => {
          const valId =
            typeof val === "object" && val !== null ? val[valueField] : val;
          return String(valId) !== String(item[valueField]);
        });
      } else {
        newList = [...(selectedValue || []), item];
      }
      onSelect(newList);
    }
  };

  const renderItem = ({ item }: { item: any }) => {
    const isSelected = singleSelect
      ? String(
          typeof selectedValue === "object" && selectedValue !== null
            ? selectedValue[valueField]
            : selectedValue,
        ) === String(item[valueField])
      : (selectedValue || [])?.some((val: any) => {
          const valId =
            typeof val === "object" && val !== null ? val[valueField] : val;
          return String(valId) === String(item[valueField]);
        });

    return (
      <TouchableOpacity
        onPress={() => handleSelect(item)}
        className={`flex-row items-center py-4 border-b border-slate-100 ${isSelected ? "bg-blue-50/50" : ""}`}
        style={{ paddingHorizontal: 20 }}
      >
        <View
          className={`w-10 h-10 rounded-full items-center justify-center mr-4 ${isSelected ? "bg-primary" : "bg-slate-100"}`}
        >
          <Ionicons
            name={
              isSelected
                ? "checkmark"
                : title?.toLowerCase().includes("project")
                  ? "briefcase-outline"
                  : "location-outline"
            }
            size={20}
            color={isSelected ? "white" : "#64748b"}
          />
        </View>
        <View className="flex-1">
          <Text
            className={`font-semibold text-base ${isSelected ? "text-primary" : "text-slate-800"}`}
          >
            {item[labelField]}
          </Text>
          {item.description && (
            <Text className="text-slate-400 text-xs" numberOfLines={1}>
              {item.description}
            </Text>
          )}
        </View>
        {!singleSelect && (
          <View
            className={`w-6 h-6 rounded-md border-2 items-center justify-center ${isSelected ? "bg-primary border-primary" : "border-slate-200"}`}
          >
            {isSelected && (
              <Ionicons name="checkmark" size={14} color="white" />
            )}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onSwipeComplete={onClose}
      swipeDirection={["down"]}
      style={{ margin: 0, justifyContent: "flex-end" }}
      propagateSwipe={true}
      avoidKeyboard={true}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1, justifyContent: "flex-end" }}
      >
        <View className="bg-white rounded-t-[32px] h-[80%] pt-2">
          {/* Handle */}
          <View className="items-center mb-2">
            <View className="w-12 h-1.5 bg-slate-200 rounded-full" />
          </View>

          {/* Header */}
          <View className="flex-row items-center justify-between px-6 py-4">
            <Text className="font-bold text-xl text-slate-900">{title}</Text>
            <TouchableOpacity
              onPress={onClose}
              className="w-10 h-10 bg-slate-100 rounded-full items-center justify-center"
            >
              <Ionicons name="close" size={24} color="#0f172a" />
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <View className="px-6 mb-4">
            <View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3">
              <Ionicons name="search-outline" size={20} color="#94a3b8" />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder={placeholder}
                placeholderTextColor="#94a3b8"
                className="flex-1 ml-3 text-base py-0 text-slate-900 font-medium"
              />
              {searchQuery !== "" && (
                <TouchableOpacity onPress={() => setSearchQuery("")}>
                  <Ionicons name="close-circle" size={20} color="#cbd5e1" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* List */}
          <FlatList
            data={filteredData}
            renderItem={renderItem}
            keyExtractor={(item) => String(item[valueField])}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
            ListEmptyComponent={() => (
              <View className="items-center justify-center mt-20 px-10">
                <View className="w-20 h-20 bg-slate-50 rounded-full items-center justify-center mb-4">
                  <Ionicons name="search-outline" size={40} color="#e2e8f0" />
                </View>
                <Text className="text-slate-400 text-center font-medium">
                  We couldn&apos;t find any results matching your search.
                </Text>
              </View>
            )}
          />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default PremiumSelectionModal;

//  <TouchableOpacity
//               onPress={() => setIsProjectClockOutModalVisible(true)}
//               className="bg-slate-50 border border-slate-200 rounded-2xl flex-row items-center justify-between px-4 py-4"
//             >
//               <View className="flex-row items-center flex-1">
//                 <Ionicons name="briefcase-outline" size={18} color={COLORS['primary']} />
//                 <Text
//                   className={`ml-2 font-semibold ${selectedProjectForClockOut?.length > 0 ? 'text-slate-900' : 'text-slate-400'}`}
//                   style={{ fontSize: getResponsiveFontSize('sm') }}
//                   numberOfLines={1}
//                 >
//                   {selectedProjectForClockOut?.length > 0
//                     ? selectedProjectForClockOut
//                         .map(p => {
//                           if (!p) return '';
//                           if (typeof p === 'object') return p.label || p.name || p.title || '';
//                           const project = projectQuery.data?.find(
//                             proj => String(proj.id) === String(p)
//                           );
//                           return project ? project.name : p;
//                         })
//                         .filter(Boolean)
//                         .join(', ')
//                     : 'Select Activities'}
//                 </Text>
//               </View>
//               <Ionicons name="chevron-down" size={18} color={COLORS['slate-400']} />
//             </TouchableOpacity>
