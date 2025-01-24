import { z } from "zod";

export const employeeSchema = z.object({
  // Personal Data
  nome: z.string().min(1, "Nome é obrigatório"),
  cpf: z.string().min(11, "CPF inválido").max(14, "CPF inválido"),
  matricula: z.string().min(1, "Matrícula é obrigatória"),
  genero: z.boolean(),
  endereco: z.string().optional(),
  imagem: z.string().optional(),
  
  // Professional Data
  funcao_id: z.string().min(1, "Função é obrigatória"),
  centro_custo_id: z.string().min(1, "Centro de Custo é obrigatório"),
  empresa_id: z.string().min(1, "Empresa é obrigatória"),
  equipe_id: z.string().optional(),
  
  // Financial Data
  salario: z.number().min(1, "Salário é obrigatório"),
  insalubridade: z.number().optional(),
  periculosidade: z.number().optional(),
  gratificacao: z.number().optional(),
  adicional_noturno: z.number().optional(),
  custo_passagem: z.number().optional(),
  refeicao: z.number().optional(),
  diarias: z.number().optional(),
  
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
  equipe?: { nome: string };
}

export interface EmployeeTableProps {
  employees: Employee[];
  isLoading: boolean;
}

export type FormStep = "personal" | "professional" | "contract" | "financial";