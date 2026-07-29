import * as z from "zod";

export const createAdminSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  phoneNumber: z.string().min(10, "Valid phone number is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  profile: z.object({
    fullName: z.string().min(1, "Full name is required"),
    address: z.string().min(1, "Address is required"),
    dateOfBirth: z.string().min(1, "Date of birth is required"),
    joiningDate: z.string().min(1, "Joining date is required"),
    gender: z.enum(["MALE", "FEMALE", "OTHER"] as const),
  }),
});

export const updateAdminSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  phoneNumber: z.string().min(10, "Valid phone number is required"),
  profile: z.object({
    fullName: z.string().min(1, "Full name is required"),
    address: z.string().min(1, "Address is required"),
    dateOfBirth: z.string().min(1, "Date of birth is required"),
    joiningDate: z.string().min(1, "Joining date is required"),
    gender: z.enum(["MALE", "FEMALE", "OTHER"] as const),
  }),
});



