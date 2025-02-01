import * as z from "zod";

export const permissionTypeSchema = z.object({
  name: z
    .string()
    .min(1, "O identificador é obrigatório")
    .regex(/^[a-z_]+$/, "Use apenas letras minúsculas e underscores"),
  label: z.string().min(1, "O nome é obrigatório"),
  description: z.string().optional(),
});

export type PermissionTypeFormValues = z.infer<typeof permissionTypeSchema>;