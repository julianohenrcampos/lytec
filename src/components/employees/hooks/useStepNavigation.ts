import { UseFormReturn } from "react-hook-form";
import { EmployeeFormValues, FormStep } from "../types";

export const useStepNavigation = (
  form: UseFormReturn<EmployeeFormValues>,
  currentStep: FormStep,
  setCurrentStep: (step: FormStep) => void
) => {
  const handleNext = async () => {
    const fieldsToValidate = getFieldsForStep(currentStep);
    console.log("Current step:", currentStep);
    console.log("Fields to validate:", fieldsToValidate);
    console.log("Current form values:", form.getValues());
    
    const isValid = await form.trigger(fieldsToValidate);
    console.log("Form validation result:", isValid);
    
    if (!isValid) {
      const errors = form.formState.errors;
      console.log("Form validation errors:", errors);
      return false;
    }

    const nextSteps: Record<FormStep, FormStep> = {
      personal: "professional",
      professional: "financial",
      financial: "contract",
      contract: "contract",
    };
    
    console.log("Moving to next step:", nextSteps[currentStep]);
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
      return ["nome", "cpf", "matricula", "genero"];
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