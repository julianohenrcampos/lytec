import { UseFormReturn } from "react-hook-form";
import { EmployeeFormValues, FormStep } from "../types";

export const useStepNavigation = (
  form: UseFormReturn<EmployeeFormValues>,
  currentStep: FormStep,
  setCurrentStep: (step: FormStep) => void
) => {
  const handleNext = async () => {
    const fieldsToValidate = getFieldsForStep(currentStep);
    console.log("Validating fields for step:", currentStep, fieldsToValidate);
    
    const isValid = await form.trigger(fieldsToValidate);
    console.log("Validation result:", isValid);
    
    if (!isValid) {
      const errors = form.formState.errors;
      console.log("Form errors:", errors);
      return false;
    }

    const nextSteps: Record<FormStep, FormStep> = {
      personal: "professional",
      professional: "financial",
      financial: "contract",
      contract: "contract",
    };
    
    setCurrentStep(nextSteps[currentStep]);
    return true;
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

  return { handleNext, handlePrevious };
};

const getFieldsForStep = (step: FormStep): Array<keyof EmployeeFormValues> => {
  switch (step) {
    case "personal":
      return ["nome", "cpf", "matricula"];
    case "professional":
      return ["funcao_id", "centro_custo_id", "empresa_id"];
    case "financial":
      return ["salario"];
    case "contract":
      return ["admissao"];
    default:
      return [];
  }
};