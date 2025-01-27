import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { FormFields } from "./form/FormFields";
import { plantSchema, type PlantFormValues } from "./form/schema";
import { useFormSubmit } from "./form/useFormSubmit";

interface PlantFormProps {
  onSuccess: () => void;
  initialData?: {
    id: string;
    usina: string;
    endereco: string | null;
    producao_total: number | null;
  };
}

export function PlantForm({ onSuccess, initialData }: PlantFormProps) {
  const form = useForm<PlantFormValues>({
    resolver: zodResolver(plantSchema),
    defaultValues: {
      usina: initialData?.usina || "",
      endereco: initialData?.endereco || "",
      producao_total: initialData?.producao_total?.toString() || "",
    },
  });

  const { isSubmitting, handleSubmit } = useFormSubmit({ initialData, onSuccess });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormFields form={form} />

        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              form.reset();
              onSuccess();
            }}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {initialData ? "Atualizar" : "Salvar"}
          </Button>
        </div>
      </form>
    </Form>
  );
}