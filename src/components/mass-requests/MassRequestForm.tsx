import { useForm, FormProvider } from "react-hook-form";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { FormFields } from "./form/FormFields";
import { StreetList } from "./StreetList";
import { useFormSubmit } from "./hooks/useFormSubmit";
import { FormValues, MassRequest } from "./types";

interface MassRequestFormProps {
  initialData?: MassRequest | null;
  onSuccess: () => void;
}

export function MassRequestForm({ initialData, onSuccess }: MassRequestFormProps) {
  const { user } = useAuth();
  const { onSubmit, isSubmitting } = useFormSubmit({ initialData, onSuccess });

  const methods = useForm<FormValues>({
    defaultValues: initialData
      ? {
          ...initialData,
          data: new Date(initialData.data),
          traco: initialData.traco,
          streets: initialData.streets || Array.from({ length: 10 }, () => ({
            logradouro: "",
            bairro: "",
            largura: 0,
            comprimento: 0,
            espessura: 0,
            traco: "",
            ligante: "",
          })),
        }
      : {
          centro_custo: "",
          diretoria: "",
          gerencia: "",
          engenheiro: user?.email || "",
          data: new Date(),
          ligante: "",
          traco: "",
          streets: Array.from({ length: 10 }, () => ({
            logradouro: "",
            bairro: "",
            largura: 0,
            comprimento: 0,
            espessura: 0,
            traco: "",
            ligante: "",
          })),
        },
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="p-6 bg-white shadow-lg rounded-lg max-w-5xl mx-auto">
        <h2 className="text-xl font-bold mb-4 text-center">REQUISIÇÃO DE ASFALTO</h2>
        <FormFields />
        <div className="mt-4">
          <StreetList />
        </div>
        <div className="flex justify-end space-x-2 mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              methods.reset();
              onSuccess();
            }}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {initialData ? "Atualizar" : "Criar"} Requisição
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}