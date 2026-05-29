import { Platform } from 'react-native';

// For Android emulator/physical devices, use your machine's local Wi-Fi IP address.
const LOCALHOST = '192.168.8.67';

export const API_BASE_URL = `http://${LOCALHOST}:4000/api`;

export const ENDPOINTS = {
  login: '/v1.0/auth/login',
  refreshToken: '/v1.0/auth/refresh-token',
  registerPatient: '/v1.0/users/create-patient',
  registerDoctor: '/v1.0/users/create-doctor',
  users: '/v1.0/users',
  patients: '/v1.0/patients',
  specializations: '/v1.0/specializations',
  services: '/v1.0/services',
  timeSlots: '/v1.0/time-slots',
  availableDoctors: '/v1.0/available-doctors',
  availableServices: '/v1.0/available-services',
  appointments: '/v1.0/appointments',
};

export const AUTH_STORAGE_KEY = 'auth_token';
export const USER_STORAGE_KEY = 'auth_user';
export const THEME_STORAGE_KEY = 'app_theme';
