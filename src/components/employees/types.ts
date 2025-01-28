import { z } from "zod";

export const employeeSchema = z.object({
  // Personal Data
  nome: z.string().min(1, "Nome é obrigatório"),
  cpf: z.string().min(11, "CPF inválido").max(14, "CPF inválido"),
  matricula: z.string().min(1, "Matrícula é obrigatória"),
  genero: z.boolean().default(true),
  endereco: z.string().optional(),
  imagem: z.string().optional(),
  escolaridade: z.enum(["Fundamental", "Médio", "Técnico", "Superior"]).default("Médio"),
  
  // Professional Data
  funcao_id: z.string().min(1, "Função é obrigatória"),
  centro_custo_id: z.string().min(1, "Centro de Custo é obrigatório"),
  empresa_id: z.string().min(1, "Empresa é obrigatória"),
  empresa_proprietaria_id: z.string().optional(),
  equipe_id: z.string().optional(),
  
  // Financial Data
  salario: z.coerce.number().min(1, "Salário é obrigatório"),
  insalubridade: z.coerce.number().optional(),
  periculosidade: z.coerce.number().optional(),
  gratificacao: z.coerce.number().optional(),
  adicional_noturno: z.coerce.number().optional(),
  custo_passagem: z.coerce.number().optional(),
  refeicao: z.coerce.number().optional(),
  diarias: z.coerce.number().optional(),
  
  // Contract Data
  admissao: z.string().min(1, "Data de Admissão é obrigatória"),
  demissao: z.string().optional(),
  ativo: z.boolean().default(true),
  aviso: z.boolean().default(false),
});

export type EmployeeFormValues = z.infer<typeof employeeSchema>;

export interface Employee extends EmployeeFormValues {
  id: string;
  created_at: string;
  funcao?: { nome: string };
  centro_custo?: { nome: string };
  empresa?: { nome: string };
  empresa_proprietaria?: { nome: string };
  equipe?: { nome: string };
}