import { z } from "zod";
import { createAdminSchema, updateAdminSchema } from "@/src/schemas";

export type TCreateAdminFields = z.infer<typeof createAdminSchema>;
export type TUpdateAdminFields = z.infer<typeof updateAdminSchema>;
export type TAdminFormFields = TUpdateAdminFields & {
  password?: string;
};


