import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { EmployeeFormValues, FormStep } from "../types";
import { format, addDays } from "date-fns";

interface UseEmployeeFormSubmitOptions {
  onSuccess: () => void;
  onError: (error: Error) => void;
}

export const useEmployeeFormSubmit = (
  currentStep: FormStep,
  handleNext: () => Promise<boolean>,
  options: UseEmployeeFormSubmitOptions
) => {
  const createEmployee = useMutation({
    mutationFn: async (values: EmployeeFormValues) => {
      const { error } = await supabase.from("bd_rhasfalto").insert({
        nome: values.nome,
        cpf: values.cpf,
        matricula: values.matricula,
        genero: values.genero,
        endereco: values.endereco,
        imagem: values.imagem,
        funcao_id: values.funcao_id,
        centro_custo_id: values.centro_custo_id,
        empresa_id: values.empresa_id,
        equipe_id: values.equipe_id,
        salario: Number(values.salario),
        insalubridade: values.insalubridade ? Number(values.insalubridade) : null,
        periculosidade: values.periculosidade ? Number(values.periculosidade) : null,
        gratificacao: values.gratificacao ? Number(values.gratificacao) : null,
        adicional_noturno: values.adicional_noturno ? Number(values.adicional_noturno) : null,
        custo_passagem: values.custo_passagem ? Number(values.custo_passagem) : null,
        refeicao: values.refeicao ? Number(values.refeicao) : null,
        diarias: values.diarias ? Number(values.diarias) : null,
        admissao: values.admissao,
        demissao: values.demissao || null,
        ativo: values.ativo,
        aviso: values.aviso,
        ferias: format(addDays(new Date(values.admissao), 365), "yyyy-MM-dd"),
      });
      if (error) throw error;
    },
    onSuccess: options.onSuccess,
    onError: options.onError,
  });

  const onSubmit = async (values: EmployeeFormValues) => {
    if (currentStep !== "contract") {
      await handleNext();
      return;
    }
    createEmployee.mutate(values);
  };

  return { onSubmit };
};