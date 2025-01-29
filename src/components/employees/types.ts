import { z } from "zod";

export type FormStep = "personal" | "professional" | "contract" | "financial";

export const employeeSchema = z.object({
  id: z.string().optional(),
  nome: z.string().min(1, "Nome é obrigatório"),
  cpf: z.string().min(11, "CPF inválido").max(14, "CPF inválido"),
  matricula: z.string().min(1, "Matrícula é obrigatória"),
  funcao_id: z.string().min(1, "Função é obrigatória"),
  centro_custo_id: z.string().min(1, "Centro de Custo é obrigatório"),
  empresa_proprietaria_id: z.string().min(1, "Empresa Proprietária é obrigatória"),
  equipe_id: z.string().optional(),
  salario: z.coerce.number().min(1, "Salário é obrigatório"),
  insalubridade: z.coerce.number().optional(),
  periculosidade: z.coerce.number().optional(),
  gratificacao: z.coerce.number().optional(),
  adicional_noturno: z.coerce.number().optional(),
  custo_passagem: z.coerce.number().optional(),
  refeicao: z.coerce.number().optional(),
  diarias: z.coerce.number().optional(),
  admissao: z.string().min(1, "Data de Admissão é obrigatória"),
  demissao: z.string().optional(),
  ativo: z.boolean().default(true),
  aviso: z.boolean().default(false),
  endereco: z.string().optional(),
  imagem: z.string().optional(),
  escolaridade: z.enum(["Fundamental", "Médio", "Técnico", "Superior"]).default("Médio"),
  genero: z.boolean().default(true),
  permissoes: z.array(z.object({
    tela: z.string(),
    acesso: z.boolean()
  })).optional(),
});

export type EmployeeFormValues = z.infer<typeof employeeSchema>;

export interface EmployeeWithRelations extends EmployeeFormValues {
  funcao?: { id: string; nome: string };
  centro_custo?: { id: string; nome: string };
  empresa_proprietaria?: { id: string; nome: string };
  equipe?: { id: string; nome: string };
  ferias?: string;
}