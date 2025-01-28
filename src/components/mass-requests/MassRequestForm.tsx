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
          streets: initialData.streets || [{
            logradouro: initialData.logradouro,
            bairro: initialData.bairro,
            largura: initialData.largura,
            comprimento: initialData.comprimento,
            espessura: initialData.espessura,
            traco: initialData.traco,
            ligante: initialData.ligante,
          }],
        }
      : {
          centro_custo: "",
          diretoria: "",
          gerencia: "",
          engenheiro: user?.email || "",
          data: new Date(),
          ligante: "",
          traco: "",
          streets: [{
            logradouro: "",
            bairro: "",
            largura: 0,
            comprimento: 0,
            espessura: 0,
            traco: "",
            ligante: "",
          }],
        },
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6 w-full max-w-full overflow-hidden px-1">
        <FormFields />

        <div className="space-y-4">
          <StreetList />
        </div>

        <div className="flex justify-end space-x-2">
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