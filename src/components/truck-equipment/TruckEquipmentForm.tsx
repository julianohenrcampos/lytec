import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import type { TruckEquipment } from "./types";
import { FormFields } from "./form/FormFields";
import { formSchema, type FormValues } from "./form/types";
import { useFormSubmit } from "./form/useFormSubmit";

const currentYear = new Date().getFullYear();
const yearOptions = Array.from({ length: 51 }, (_, i) => currentYear - i);

interface TruckEquipmentFormProps {
  initialData?: TruckEquipment | null;
  onSuccess?: () => void;
}

export function TruckEquipmentForm({ initialData, onSuccess }: TruckEquipmentFormProps) {
  const { data: fleets } = useQuery({
    queryKey: ["fleets"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bd_frota")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      frota_id: initialData?.frota_id || "",
      tipo: initialData?.tipo || "Caminhão",
      modelo: initialData?.modelo || "",
      ano: initialData?.ano || undefined,
      capacidade: initialData?.capacidade || undefined,
      proprietario: initialData?.proprietario || "",
      descricao: initialData?.descricao || "",
      placa: initialData?.placa || "",
      aluguel: initialData?.aluguel || undefined,
      imagem: undefined,
    },
  });

  const { createMutation, updateMutation } = useFormSubmit({ initialData, onSuccess });

  const onSubmit = (values: FormValues) => {
    console.log("Form submitted with values:", values);
    if (initialData) {
      updateMutation.mutate(values);
    } else {
      createMutation.mutate(values);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormFields 
          form={form}
          fleets={fleets || []}
          yearOptions={yearOptions}
        />

        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              form.reset();
              onSuccess?.();
            }}
          >
            Cancelar
          </Button>
          <Button type="submit">
            {initialData ? "Atualizar" : "Salvar"}
          </Button>
        </div>
      </form>
    </Form>
  );
}