import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { EmployeeFormValues } from "../types";
import { format, addDays } from "date-fns";

interface UseEmployeeFormSubmitOptions {
  onSuccess?: () => void;
}

export const useEmployeeFormSubmit = (options?: UseEmployeeFormSubmitOptions) => {
  const mutation = useMutation({
    mutationFn: async (values: EmployeeFormValues) => {
      console.log("Submitting employee data:", values);
      
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
        equipe_id: values.equipe_id || null,
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

      if (error) {
        console.error("Error submitting employee:", error);
        throw error;
      }
    },
    onSuccess: options?.onSuccess,
  });

  return {
    onSubmit: mutation.mutate,
    isSubmitting: mutation.isPending
  };
};