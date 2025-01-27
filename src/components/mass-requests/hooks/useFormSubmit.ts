import { useState } from "react";
import { FormValues, MassRequest } from "../types";
import { useCreateMassRequest } from "./useCreateMassRequest";
import { useUpdateMassRequest } from "./useUpdateMassRequest";

interface UseFormSubmitProps {
  initialData?: MassRequest | null;
  onSuccess: () => void;
}

export function useFormSubmit({ initialData, onSuccess }: UseFormSubmitProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createMutation = useCreateMassRequest(onSuccess);
  const updateMutation = useUpdateMassRequest(initialData, onSuccess);

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      if (initialData) {
        await updateMutation.mutateAsync(values);
      } else {
        await createMutation.mutateAsync(values);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    onSubmit,
    isSubmitting,
  };
}