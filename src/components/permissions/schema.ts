import * as z from "zod";

export const permissionFormSchema = z.object({
  usuario_id: z.string({
    required_error: "Selecione um usuário",
  }),
  telas: z.record(z.boolean()).default({}),
  acesso: z.boolean().default(true),
  permissao_usuario: z.enum(['admin', 'rh', 'transporte', 'logistica', 'motorista', 'operador', 'apontador', 'encarregado']).optional(),
});

export type PermissionFormValues = z.infer<typeof permissionFormSchema>;