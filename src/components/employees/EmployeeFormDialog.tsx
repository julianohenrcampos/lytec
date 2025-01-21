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
import { Plus } from "lucide-react";
import { employeeSchema, EmployeeFormValues, FormStep } from "./types";
import { PersonalDataForm } from "./forms/PersonalDataForm";
import { ProfessionalDataForm } from "./forms/ProfessionalDataForm";
import { FinancialDataForm } from "./forms/FinancialDataForm";
import { ContractDataForm } from "./forms/ContractDataForm";
import { useStepNavigation } from "./hooks/useStepNavigation";

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

  console.log("Current form state:", form.getValues());
  console.log("Current step:", currentStep);

  const { handleNext, handlePrevious } = useStepNavigation(form, currentStep, setCurrentStep);

  const onSubmit = async (data: EmployeeFormValues) => {
    console.log("Submitting form with data:", data);
    
    if (currentStep !== "contract") {
      const success = await handleNext();
      if (!success) {
        console.log("Validation failed, not proceeding to next step");
      }
      return;
    }

    try {
      // Ensure all required fields are present and properly typed
      const employeeData = {
        nome: data.nome,
        cpf: data.cpf,
        matricula: data.matricula,
        genero: data.genero,
        endereco: data.endereco || null,
        imagem: data.imagem || null,
        funcao_id: data.funcao_id,
        centro_custo_id: data.centro_custo_id,
        empresa_id: data.empresa_id,
        equipe_id: data.equipe_id || null,
        salario: Number(data.salario),
        insalubridade: data.insalubridade ? Number(data.insalubridade) : null,
        periculosidade: data.periculosidade ? Number(data.periculosidade) : null,
        gratificacao: data.gratificacao ? Number(data.gratificacao) : null,
        adicional_noturno: data.adicional_noturno ? Number(data.adicional_noturno) : null,
        custo_passagem: data.custo_passagem ? Number(data.custo_passagem) : null,
        refeicao: data.refeicao ? Number(data.refeicao) : null,
        diarias: data.diarias ? Number(data.diarias) : null,
        admissao: data.admissao,
        demissao: data.demissao || null,
        ativo: data.ativo,
        aviso: data.aviso
      };

      console.log("Sending to Supabase:", employeeData);

      const { error } = await supabase
        .from("bd_rhasfalto")
        .insert(employeeData);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast({ title: "Funcionário cadastrado com sucesso!" });
      setOpen(false);
      form.reset();
      setCurrentStep("personal");
    } catch (error: any) {
      console.error("Error in form submission:", error);
      toast({
        variant: "destructive",
        title: "Erro ao cadastrar funcionário",
        description: error.message,
      });
    }
  };

  const renderStepContent = () => {
    console.log("Rendering step content for:", currentStep);
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