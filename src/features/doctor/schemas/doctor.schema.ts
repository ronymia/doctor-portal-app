import * as z from "zod";

// INLINE SCHEMA FOR DOCTOR FORM
export const doctorSchema = z.object({
  email: z.email("Invalid email address").min(1, "Email is required"),
  phoneNumber: z.string().min(10, "Valid phone number is required"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .optional(),
  doctor: z.object({
    specializationId: z.string().min(1, "Specialization is required"),
    qualification: z.string().min(1, "Qualification is required"),
  }),
  profile: z.object({
    fullName: z.string().min(1, "Full name is required"),
    address: z.string().min(1, "Address is required"),
    gender: z.enum(["MALE", "FEMALE", "OTHER"] as const),
    dateOfBirth: z.string().min(1, "Date of birth is required"),
    joiningDate: z.string().min(1, "Joining date is required"),
  }),
});

export const updateDoctorSchema = z.object({
  email: z
    .email("Invalid email address")
    .min(1, "Email is required")
    .optional()
    .or(z.literal("")),
  phoneNumber: z.string().optional().or(z.literal("")),
  doctor: z.object({
    specializationId: z.string().optional().or(z.literal("")),
    qualification: z.string().optional().or(z.literal("")),
  }),
  profile: z.object({
    fullName: z.string().optional().or(z.literal("")),
    address: z.string().optional().or(z.literal("")),
    gender: z.enum(["MALE", "FEMALE", "OTHER"] as const).optional(),
    dateOfBirth: z.string().optional().or(z.literal("")),
    joiningDate: z.string().optional().or(z.literal("")),
  }),
});

export type TDoctorFormFields = z.infer<typeof doctorSchema>;
export type TUpdateDoctorFormFields = z.infer<typeof updateDoctorSchema>;
