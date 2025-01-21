import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import PersonalDataForm from "./forms/PersonalDataForm";
import ProfessionalDataForm from "./forms/ProfessionalDataForm";
import ContractDataForm from "./forms/ContractDataForm";
import FinancialDataForm from "./forms/FinancialDataForm";
import useStepNavigation from "./hooks/useStepNavigation";
import type { TablesInsert } from "@/integrations/supabase/types";

type Employee = TablesInsert<"bd_rhasfalto">;

export default function EmployeeFormDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Partial<Employee>>({});
  const { currentStep, nextStep, previousStep, isLastStep, isFirstStep } =
    useStepNavigation(4);

  const handleSubmit = async () => {
    try {
      console.log("Form data before submission:", formData);

      // Ensure all required fields are present and properly typed
      const employeeData: Employee = {
        nome: formData.nome!,
        cpf: formData.cpf!,
        matricula: formData.matricula!,
        funcao_id: formData.funcao_id!,
        centro_custo_id: formData.centro_custo_id!,
        empresa_id: formData.empresa_id!,
        salario: Number(formData.salario!),
        admissao: formData.admissao!,
        // Optional fields
        equipe_id: formData.equipe_id || null,
        insalubridade: formData.insalubridade ? Number(formData.insalubridade) : null,
        periculosidade: formData.periculosidade ? Number(formData.periculosidade) : null,
        gratificacao: formData.gratificacao ? Number(formData.gratificacao) : null,
        adicional_noturno: formData.adicional_noturno ? Number(formData.adicional_noturno) : null,
        custo_passagem: formData.custo_passagem ? Number(formData.custo_passagem) : null,
        refeicao: formData.refeicao ? Number(formData.refeicao) : null,
        diarias: formData.diarias ? Number(formData.diarias) : null,
        ferias: formData.ferias || null,
        demissao: formData.demissao || null,
        ativo: formData.ativo !== undefined ? formData.ativo : true,
        aviso: formData.aviso || false,
        endereco: formData.endereco || null,
        imagem: formData.imagem || null,
        escolaridade: formData.escolaridade || null,
        genero: formData.genero || null,
        empresa_proprietaria_id: formData.empresa_proprietaria_id || null,
        departamento_id: formData.departamento_id || null,
      };

      console.log("Structured employee data:", employeeData);

      const { error } = await supabase
        .from("bd_rhasfalto")
        .insert([employeeData]);

      if (error) throw error;

      toast({
        title: "Funcionário cadastrado com sucesso!",
        variant: "default",
      });

      onOpenChange(false);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Erro ao cadastrar funcionário",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    }
  };

  const handleStepSubmit = (stepData: Partial<Employee>) => {
    console.log("Step data received:", stepData);
    setFormData((prev) => ({ ...prev, ...stepData }));

    if (isLastStep) {
      handleSubmit();
    } else {
      nextStep();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Cadastro de Funcionário - Etapa {currentStep + 1}</DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          {currentStep === 0 && (
            <PersonalDataForm
              onSubmit={handleStepSubmit}
              initialData={formData}
            />
          )}
          {currentStep === 1 && (
            <ProfessionalDataForm
              onSubmit={handleStepSubmit}
              initialData={formData}
            />
          )}
          {currentStep === 2 && (
            <ContractDataForm
              onSubmit={handleStepSubmit}
              initialData={formData}
            />
          )}
          {currentStep === 3 && (
            <FinancialDataForm
              onSubmit={handleStepSubmit}
              initialData={formData}
            />
          )}
        </div>

        <div className="flex justify-between mt-4">
          <Button
            variant="outline"
            onClick={previousStep}
            disabled={isFirstStep}
          >
            Anterior
          </Button>
          <Button
            onClick={() => {
              const currentForm = document.querySelector("form");
              if (currentForm) {
                currentForm.requestSubmit();
              }
            }}
          >
            {isLastStep ? "Finalizar" : "Próximo"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}