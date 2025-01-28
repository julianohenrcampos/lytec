import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { format, addDays } from "date-fns";
import { employeeSchema } from "./types";
import { BasicInfoForm } from "./forms/BasicInfoForm";
import { ProfessionalInfoForm } from "./forms/ProfessionalInfoForm";
import { FinancialInfoForm } from "./forms/FinancialInfoForm";
import { AdditionalInfoForm } from "./forms/AdditionalInfoForm";

type EmployeeFormValues = z.infer<typeof employeeSchema>;

export const EmployeeForm = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      nome: "",
      cpf: "",
      matricula: "",
      funcao_id: "",
      centro_custo_id: "",
      empresa_proprietaria_id: "",
      equipe_id: "",
      salario: 0,
      insalubridade: 0,
      periculosidade: 0,
      gratificacao: 0,
      adicional_noturno: 0,
      custo_passagem: 0,
      refeicao: 0,
      diarias: 0,
      admissao: "",
      demissao: "",
      ativo: true,
      aviso: false,
      endereco: "",
      imagem: "",
      escolaridade: "Médio",
      genero: true,
    },
  });

  const createEmployee = useMutation({
    mutationFn: async (values: EmployeeFormValues) => {
      console.log("Submitting values:", values);
      const ferias = format(addDays(new Date(values.admissao), 365), "yyyy-MM-dd");
      
      const { error } = await supabase.from("bd_rhasfalto").insert([
        {
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
          admissao: values.admissao,
          demissao: values.demissao || null,
          ativo: values.ativo,
          aviso: values.aviso,
          endereco: values.endereco || null,
          imagem: values.imagem || null,
          escolaridade: values.escolaridade,
          genero: values.genero,
          ferias,
        },
      ]);

      if (error) {
        console.error("Error creating employee:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast({
        title: "Funcionário cadastrado com sucesso!",
      });
      form.reset();
    },
    onError: (error: Error) => {
      console.error("Error in mutation:", error);
      toast({
        variant: "destructive",
        title: "Erro ao cadastrar funcionário",
        description: error.message,
      });
    },
  });

  const onSubmit = (values: EmployeeFormValues) => {
    console.log("Form values before submission:", values);
    createEmployee.mutate(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium">Dados Básicos</h3>
            <BasicInfoForm form={form} />
          </div>

          <div>
            <h3 className="text-lg font-medium">Dados Profissionais</h3>
            <ProfessionalInfoForm form={form} />
          </div>

          <div>
            <h3 className="text-lg font-medium">Dados Financeiros</h3>
            <FinancialInfoForm form={form} />
          </div>

          <div>
            <h3 className="text-lg font-medium">Dados Adicionais</h3>
            <AdditionalInfoForm form={form} />
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => form.reset()}
          >
            Cancelar
          </Button>
          <Button type="submit">Salvar</Button>
        </div>
      </form>
    </Form>
  );
};