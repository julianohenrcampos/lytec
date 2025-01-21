import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { format, addDays } from "date-fns";
import { Plus } from "lucide-react";
import { employeeSchema, EmployeeFormValues, FormStep } from "./types";
import { PersonalDataForm } from "./forms/PersonalDataForm";
import { ProfessionalDataForm } from "./forms/ProfessionalDataForm";
import { FinancialDataForm } from "./forms/FinancialDataForm";
import { ContractDataForm } from "./forms/ContractDataForm";

export const EmployeeFormDialog = React.forwardRef<HTMLDivElement>((_, ref) => {
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<FormStep>("personal");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      nome: "",
      cpf: "",
      matricula: "",
      genero: true,
      endereco: "",
      imagem: "",
      funcao_id: "",
      centro_custo_id: "",
      empresa_id: "",
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
    },
  });

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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast({
        title: "Funcionário cadastrado com sucesso!",
      });
      setOpen(false);
      form.reset();
      setCurrentStep("personal");
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erro ao cadastrar funcionário",
        description: error.message,
      });
    },
  });

  const onSubmit = async (values: EmployeeFormValues) => {
    if (currentStep !== "contract") {
      const nextSteps: Record<FormStep, FormStep> = {
        personal: "professional",
        professional: "financial",
        financial: "contract",
        contract: "contract",
      };
      setCurrentStep(nextSteps[currentStep]);
      return;
    }
    createEmployee.mutate(values);
  };

  const handlePrevious = () => {
    const previousSteps: Record<FormStep, FormStep> = {
      personal: "personal",
      professional: "personal",
      financial: "professional",
      contract: "financial",
    };
    setCurrentStep(previousSteps[currentStep]);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case "personal":
        return <PersonalDataForm form={form} />;
      case "professional":
        return <ProfessionalDataForm form={form} />;
      case "financial":
        return <FinancialDataForm form={form} />;
      case "contract":
        return <ContractDataForm form={form} />;
      default:
        return null;
    }
  };

  const stepTitles: Record<FormStep, string> = {
    personal: "Dados Pessoais",
    professional: "Dados Profissionais",
    financial: "Dados Financeiros",
    contract: "Informações Contratuais",
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Funcionário
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl" ref={ref}>
        <DialogHeader>
          <DialogTitle>{stepTitles[currentStep]}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {renderStepContent()}
            <div className="flex justify-end space-x-2">
              {currentStep !== "personal" && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevious}
                >
                  Voltar
                </Button>
              )}
              <Button type="submit">
                {currentStep === "contract" ? "Salvar" : "Próximo"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
});

EmployeeFormDialog.displayName = "EmployeeFormDialog";