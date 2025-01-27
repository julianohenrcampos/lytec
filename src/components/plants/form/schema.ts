import { z } from "zod";

export const plantSchema = z.object({
  usina: z.string().min(1, "Nome da usina é obrigatório"),
  endereco: z.string().optional(),
  producao_total: z.string()
    .optional()
    .transform((val) => {
      if (!val) return null;
      const num = Number(val);
      return isNaN(num) ? null : num;
    }),
});

export type PlantFormValues = z.infer<typeof plantSchema>;