import React, { createContext, useContext, useState } from "react";

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

interface IModalState {
  isOpen: boolean;
  type: TModalType | null;
  data: any;
}

interface IModalContextProps {
  modalState: IModalState;
  openModal: (type: TModalType, data?: any) => void;
  closeModal: () => void;
}

const ModalContext = createContext<IModalContextProps | undefined>(undefined);

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [modalState, setModalState] = useState<IModalState>({
    isOpen: false,
    type: null,
    data: null,
  });

  const openModal = (type: TModalType, data: any = null) => {
    setModalState({ isOpen: true, type, data });
  };

  const closeModal = () => {
    setModalState({ isOpen: false, type: null, data: null });
  };

  return (
    <ModalContext.Provider value={{ modalState, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};
