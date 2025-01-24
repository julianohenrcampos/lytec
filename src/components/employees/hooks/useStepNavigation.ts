import { useState } from "react";
import { FormStep } from "../types";

export function useStepNavigation() {
  const [currentStep, setCurrentStep] = useState<FormStep>("personal");

  const STEPS: FormStep[] = ["personal", "professional", "contract", "financial"];
  const currentStepIndex = STEPS.indexOf(currentStep);
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === STEPS.length - 1;

  const nextStep = () => {
    if (!isLastStep) {
      setCurrentStep(STEPS[currentStepIndex + 1]);
    }
  };

  const previousStep = () => {
    if (!isFirstStep) {
      setCurrentStep(STEPS[currentStepIndex - 1]);
    }
  };

  return {
    currentStep,
    setCurrentStep,
    nextStep,
    previousStep,
    isLastStep,
    isFirstStep,
  };
}