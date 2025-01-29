import { useForm, FormProvider } from "react-hook-form";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { FormFields } from "./form/FormFields";
import { StreetList } from "./StreetList";
import { useFormSubmit } from "./hooks/useFormSubmit";
import { FormValues, MassRequest } from "./types";
import { Card } from "@/components/ui/card";

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
          streets: initialData.bd_ruas_requisicao?.map(street => ({
            logradouro: street.logradouro,
            bairro: street.bairro,
            largura: street.largura,
            comprimento: street.comprimento,
            espessura: street.espessura,
            traco: street.traco || initialData.traco,
            ligante: street.ligante || initialData.ligante,
            area: street.area,
            peso: street.peso,
          })) || [],
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
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Cabeçalho da Requisição</h3>
          <FormFields />
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Lista de Ruas</h3>
          <div className="space-y-4">
            <StreetList />
          </div>
        </Card>

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