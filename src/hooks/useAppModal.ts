import { useContext } from "react";
import AppModalContext from "../contexts/AppModalContext";

export default function useAppModal() {
  const context = useContext(AppModalContext);
  if (!context) {
    throw new Error("useAppModal must be used within an AppModalProvider");
  }
  return context;
}
