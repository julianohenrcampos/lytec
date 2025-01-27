import { z } from "zod";

export const plantSchema = z.object({
  usina: z.string().min(1, "Nome da usina é obrigatório"),
  endereco: z.string().optional(),
  producao_total: z.number().nullable().optional(),
});

export type PlantFormValues = z.infer<typeof plantSchema>;