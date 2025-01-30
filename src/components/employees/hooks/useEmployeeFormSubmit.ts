import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { EmployeeFormValues } from "../types";
import { format, addDays, parseISO } from "date-fns";

interface UseEmployeeFormSubmitProps {
  onSuccess?: () => void;
  initialData?: Partial<EmployeeFormValues>;
}

export const useEmployeeFormSubmit = ({ onSuccess, initialData }: UseEmployeeFormSubmitProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (values: EmployeeFormValues) => {
      console.log("Submitting employee data:", values);
      
      // Only calculate ferias if admissao is provided
      let ferias = null;
      if (values.admissao) {
        try {
          const admissaoDate = parseISO(values.admissao);
          ferias = format(addDays(admissaoDate, 365), "yyyy-MM-dd");
        } catch (error) {
          console.error("Error formatting date:", error);
          throw new Error("Invalid admission date format");
        }
      }
      
      const employeeData = {
        nome: values.nome,
        cpf: values.cpf,
        matricula: values.matricula,
        funcao_id: values.funcao_id,
        centro_custo_id: values.centro_custo_id,
        empresa_proprietaria_id: values.empresa_proprietaria_id,
        equipe_id: values.equipe_id || null,
        salario: Number(values.salario),
        insalubridade: values.insalubridade ? Number(values.insalubridade) : null,
        periculosidade: values.periculosidade ? Number(values.periculosidade) : null,
        gratificacao: values.gratificacao ? Number(values.gratificacao) : null,
        adicional_noturno: values.adicional_noturno ? Number(values.adicional_noturno) : null,
        custo_passagem: values.custo_passagem ? Number(values.custo_passagem) : null,
        refeicao: values.refeicao ? Number(values.refeicao) : null,
        diarias: values.diarias ? Number(values.diarias) : null,
        admissao: values.admissao || null,
        demissao: values.demissao || null,
        ativo: values.ativo,
        aviso: values.aviso,
        endereco: values.endereco || null,
        imagem: values.imagem || null,
        escolaridade: values.escolaridade,
        genero: values.genero,
        ferias,
      };

      if (initialData?.id) {
        const { error } = await supabase
          .from("bd_rhasfalto")
          .update(employeeData)
          .eq("id", initialData.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("bd_rhasfalto")
          .insert([employeeData]);

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast({
        title: initialData 
          ? "Funcionário atualizado com sucesso!" 
          : "Funcionário cadastrado com sucesso!",
      });
      onSuccess?.();
    },
    onError: (error: Error) => {
      console.error("Error in mutation:", error);
      toast({
        variant: "destructive",
        title: "Erro ao salvar funcionário",
        description: error.message,
      });
    },
  });

  return {
    onSubmit: (values: EmployeeFormValues) => mutation.mutate(values),
    isSubmitting: mutation.isPending,
  };
};