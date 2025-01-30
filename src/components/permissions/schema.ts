import * as z from "zod";

export const permissionFormSchema = z.object({
  usuario_id: z.string({
    required_error: "Selecione um usuário",
  }),
  tela: z.string({
    required_error: "Selecione uma tela",
  }),
  acesso: z.boolean({
    required_error: "Selecione o tipo de acesso",
  }),
  permissao_usuario: z.enum(['admin', 'rh', 'transporte', 'logistica', 'motorista', 'operador', 'apontador', 'encarregado']).optional(),
});

export type PermissionFormValues = z.infer<typeof permissionFormSchema>;