import * as z from "zod";

export const specializationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
});

export type TSpecializationFormFields = z.infer<typeof specializationSchema>;
