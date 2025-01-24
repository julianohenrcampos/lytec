import { useState } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PersonalDataForm } from "./forms/PersonalDataForm";
import { ProfessionalDataForm } from "./forms/ProfessionalDataForm";
import { ContractDataForm } from "./forms/ContractDataForm";
import { FinancialDataForm } from "./forms/FinancialDataForm";
import { Button } from "@/components/ui/button";
import { useEmployeeFormSubmit } from "./hooks/useEmployeeFormSubmit";
import { useStepNavigation } from "./hooks/useStepNavigation";
import { EmployeeFormValues } from "./types";
import { Form } from "@/components/ui/form";

interface EmployeeFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Partial<EmployeeFormValues>;
}

export function EmployeeFormDialog({ open, onOpenChange, initialData }: EmployeeFormDialogProps) {
  const form = useForm<EmployeeFormValues>({
    defaultValues: initialData || {
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

  const { currentStep, nextStep, previousStep, isLastStep, isFirstStep, setCurrentStep } = useStepNavigation();
  const { onSubmit, isSubmitting } = useEmployeeFormSubmit({ 
    onSuccess: () => onOpenChange(false) 
  });

  const handleSubmit = async (values: EmployeeFormValues) => {
    if (!isLastStep) {
      nextStep();
      return;
    }
    onSubmit(values);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Editar Funcionário" : "Cadastrar Funcionário"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <Tabs value={currentStep} onValueChange={setCurrentStep}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="personal">Dados Pessoais</TabsTrigger>
                <TabsTrigger value="professional">Dados Profissionais</TabsTrigger>
                <TabsTrigger value="contract">Dados Contratuais</TabsTrigger>
                <TabsTrigger value="financial">Dados Financeiros</TabsTrigger>
              </TabsList>
              <TabsContent value="personal">
                <PersonalDataForm
                  form={form}
                  onSubmit={onSubmit}
                  initialData={initialData}
                />
              </TabsContent>
              <TabsContent value="professional">
                <ProfessionalDataForm
                  form={form}
                  onSubmit={onSubmit}
                  initialData={initialData}
                />
              </TabsContent>
              <TabsContent value="contract">
                <ContractDataForm
                  form={form}
                  onSubmit={onSubmit}
                  initialData={initialData}
                />
              </TabsContent>
              <TabsContent value="financial">
                <FinancialDataForm
                  form={form}
                  onSubmit={onSubmit}
                  initialData={initialData}
                />
              </TabsContent>
            </Tabs>
            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={previousStep}
                disabled={isFirstStep}
              >
                Anterior
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isLastStep ? (isSubmitting ? "Salvando..." : "Salvar") : "Próximo"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}