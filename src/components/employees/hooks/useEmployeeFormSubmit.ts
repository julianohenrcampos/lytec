import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { EmployeeFormValues } from "../types";
import { format, addDays } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface UseEmployeeFormSubmitOptions {
  onSuccess?: () => void;
  initialData?: Partial<EmployeeFormValues>;
}

export const useEmployeeFormSubmit = (options?: UseEmployeeFormSubmitOptions) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (values: EmployeeFormValues) => {
      console.log("Submitting employee data:", values);
      
      // First verify if the empresa_id exists
      const { data: empresa, error: empresaError } = await supabase
        .from("bd_empresa")
        .select("id")
        .eq("id", values.empresa_id)
        .maybeSingle();

      if (empresaError) {
        console.error("Error checking empresa:", empresaError);
        throw new Error("Erro ao verificar empresa. Por favor, tente novamente.");
      }

      if (!empresa) {
        throw new Error("Empresa não encontrada. Por favor, selecione uma empresa válida.");
      }

      const employeeData = {
        nome: values.nome,
        cpf: values.cpf,
        matricula: values.matricula,
        genero: values.genero,
        endereco: values.endereco || null,
        imagem: values.imagem || null,
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
      };

      let query = supabase.from("bd_rhasfalto");

      if (options?.initialData?.id) {
        // Update existing employee
        const { data, error } = await query
          .update(employeeData)
          .eq('id', options.initialData.id)
          .select()
          .single();

        if (error) {
          console.error("Error updating employee:", error);
          throw error;
        }

        return data;
      } else {
        // Create new employee
        const { data, error } = await query
          .insert(employeeData)
          .select()
          .single();

        if (error) {
          console.error("Error creating employee:", error);
          throw error;
        }

        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast({
        title: options?.initialData?.id 
          ? "Funcionário atualizado com sucesso!" 
          : "Funcionário cadastrado com sucesso!",
        description: "Os dados foram salvos corretamente.",
      });
      options?.onSuccess?.();
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Erro ao salvar funcionário",
        description: error.message,
      });
    },
  });

  return {
    onSubmit: mutation.mutate,
    isSubmitting: mutation.isPending,
  };
};