import { z } from "zod";

const currentYear = new Date().getFullYear();

export const formSchema = z.object({
  frota_id: z.string().min(1, "Frota é obrigatória"),
  tipo: z.enum(["Caminhão", "Equipamento"], {
    required_error: "Tipo é obrigatório",
  }),
  modelo: z.string().min(1, "Modelo é obrigatório"),
  ano: z.number().min(currentYear - 50).max(currentYear).optional(),
  capacidade: z.number().min(0).optional(),
  proprietario: z.string().optional(),
  descricao: z.string().optional(),
  placa: z.string().optional(),
  aluguel: z.number().min(0).optional(),
  imagem: z.any().optional(),
});

export type FormValues = z.infer<typeof formSchema>;