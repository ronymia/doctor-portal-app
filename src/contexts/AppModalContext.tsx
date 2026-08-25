import { createContext } from "react";

// Add your modal types here as you create new forms
export type TModalType =
  | "CREATE_DOCTOR"
  | "EDIT_DOCTOR"
  | "CREATE_TIMESLOT"
  | "EDIT_TIMESLOT"
  | "ASSIGN_PERMISSIONS"
  | "CREATE_ADMIN"
  | "EDIT_ADMIN"
  | "TEST_MODAL"; // A placeholder to test the setup

export interface IModalState {
  isOpen: boolean;
  type: TModalType | null;
  data: unknown;
}

interface IModalContextProps {
  modalConfig: IModalState;
  setModalConfig: React.Dispatch<React.SetStateAction<IModalState>>;
  openModal: (type: TModalType, data?: unknown) => void;
  closeModal: (data?: unknown) => void;
}

const AppModalContext = createContext<IModalContextProps | undefined>(
  undefined,
);
export default AppModalContext;
