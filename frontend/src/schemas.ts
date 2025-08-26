import { z } from "zod";
import type { Resolver, FieldValues } from "react-hook-form";

export const userSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email format"),
  name: z
    .string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password must be less than 100 characters")
});

export const vehicleSchema = z.object({
  make: z
    .string()
    .min(1, "Make is required")
    .min(2, "Make must be at least 2 characters")
    .max(50, "Make must be less than 50 characters"),
  model: z
    .string()
    .min(1, "Model is required")
    .min(2, "Model must be at least 2 characters")
    .max(50, "Model must be less than 50 characters"),
  year: z
    .string()
    .optional()
		.transform((val) => val === "" ? undefined : val)
		.refine((val) => val === undefined || (val && !isNaN(Number(val)) && Number(val) > 1900 && Number(val) < 2025), {
			message: "Year must be between 1900 and 2025",
		}),
  userId: z
    .string()
    .min(1, "User is required"),
});

export type UserFormData = z.infer<typeof userSchema>;
export type VehicleFormData = z.infer<typeof vehicleSchema>;

// Unified Zod -> react-hook-form resolver usable across forms
function createZodResolver<TValues extends FieldValues>(schema: z.ZodType<TValues>): Resolver<TValues> {
  return async (values) => {
    const result = schema.safeParse(values);

    if (result.success) {
      return { values: result.data, errors: {} };
    }

    const errors: Record<string, any> = {};
    for (const issue of result.error.issues) {
      const field = issue.path[0] as string | undefined;
      if (!field) continue;
      if (!errors[field]) {
        errors[field] = {
          type: issue.code,
          message: issue.message,
        };
      }
    }

    return { values: {}, errors } as any;
  };
}

export const userResolver: Resolver<UserFormData> = createZodResolver<UserFormData>(userSchema);
export const vehicleResolver: Resolver<VehicleFormData> = createZodResolver<VehicleFormData>(vehicleSchema);
