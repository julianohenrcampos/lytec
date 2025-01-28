import { z } from "zod";

export const teamSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  encarregado_id: z.string().min(1, "Encarregado é obrigatório"),
  apontador_id: z.string().min(1, "Apontador é obrigatório"),
});

export type TeamFormValues = z.infer<typeof teamSchema>;