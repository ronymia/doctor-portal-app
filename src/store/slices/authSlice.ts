import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import appStorage from '../../services/storage';

export interface UserProfile {
  fullName: string;
  profilePicture?: string | null;
  address?: string;
  dateOfBirth?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
}

export interface UserDetails {
  id: string;
  email: string;
  phoneNumber: string;
  role: 'super_admin' | 'admin' | 'doctor' | 'patient';
  profile?: UserProfile;
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

interface AuthState {
  token: string | null;
  user: UserDetails | null;
  isAuthenticated: boolean;
  isRestoring: boolean;
}

const initialState: AuthState = {
  token: null,
  user: null,
  isAuthenticated: false,
  isRestoring: true,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ token: string; user: UserDetails }>
    ) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.isRestoring = false;

      // Save token and user details to storage in async manner
      appStorage.setItem('auth_token', action.payload.token).catch(() => {});
      appStorage.setItem('auth_user', JSON.stringify(action.payload.user)).catch(() => {});
    },
    updateUserProfile: (state, action: PayloadAction<UserProfile>) => {
      if (state.user) {
        state.user.profile = {
          ...state.user.profile,
          ...action.payload,
        };
        appStorage.setItem('auth_user', JSON.stringify(state.user)).catch(() => {});
      }
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.isRestoring = false;

      appStorage.removeItem('auth_token').catch(() => {});
      appStorage.removeItem('auth_user').catch(() => {});
    },
    setRestoring: (state, action: PayloadAction<boolean>) => {
      state.isRestoring = action.payload;
    },
  },
});

export const { setCredentials, updateUserProfile, logout, setRestoring } = authSlice.actions;
export default authSlice.reducer;
export const selectCurrentUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectIsRestoring = (state: { auth: AuthState }) => state.auth.isRestoring;
