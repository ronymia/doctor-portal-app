import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import appStorage from "@/src/services/storage";

export interface IUserProfile {
  fullName: string;
  profilePicture?: string | null;
  address?: string;
  dateOfBirth?: string;
  gender?: "MALE" | "FEMALE" | "OTHER";
}

export interface IUserDetails {
  id: string;
  email: string;
  phoneNumber: string;
  role: "SUPER_ADMIN" | "ADMIN" | "DOCTOR" | "PATIENT";
  permissions: string[];
  profile?: IUserProfile;
  patient?: {
    id: string;
    patientId: string;
    medicalHistory?: string;
    emergencyContact?: string;
  } | null;
  doctor?: {
    id: string;
    doctorId: string;
    qualification: string;
  } | null;
}

interface IAuthState {
  token: string | null;
  user: IUserDetails | null;
  isAuthenticated: boolean;
  isRestoring: boolean;
}

const initialState: IAuthState = {
  token: null,
  user: null,
  isAuthenticated: false,
  isRestoring: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ token: string; user: IUserDetails }>,
    ) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.isRestoring = false;

      // Save token and user details to storage in async manner
      appStorage.setItem("auth_token", action.payload.token).catch(() => {});
      appStorage
        .setItem("auth_user", JSON.stringify(action.payload.user))
        .catch(() => {});
    },
    updateUserProfile: (state, action: PayloadAction<IUserProfile>) => {
      if (state.user) {
        state.user.profile = {
          ...state.user.profile,
          ...action.payload,
        };
        appStorage
          .setItem("auth_user", JSON.stringify(state.user))
          .catch(() => {});
      }
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.isRestoring = false;

      appStorage.removeItem("auth_token").catch(() => {});
      appStorage.removeItem("auth_user").catch(() => {});
    },
    setRestoring: (state, action: PayloadAction<boolean>) => {
      state.isRestoring = action.payload;
    },
  },
  extraReducers(builder) {},
});

export const { setCredentials, updateUserProfile, logout, setRestoring } =
  authSlice.actions;
export default authSlice.reducer;
export const selectCurrentUser = (state: { auth: IAuthState }) =>
  state.auth.user;
export const selectIsAuthenticated = (state: { auth: IAuthState }) =>
  state.auth.isAuthenticated;
export const selectIsRestoring = (state: { auth: IAuthState }) =>
  state.auth.isRestoring;
