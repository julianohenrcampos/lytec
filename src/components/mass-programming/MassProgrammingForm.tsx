import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useFormLogic } from "./hooks/useFormLogic";
import { useFormQueries } from "./hooks/useFormQueries";
import { DateField } from "./form-fields/DateField";
import { SelectFields } from "./form-fields/SelectFields";
import { InputFields } from "./form-fields/InputFields";
import { MassProgrammingFormProps } from "./types";
import { Card } from "@/components/ui/card";

export function MassProgrammingForm({ initialData, onSuccess }: MassProgrammingFormProps) {
  const { form, isSubmitting, onSubmit, handleDuplicate, handleNewLine } = useFormLogic(initialData, onSuccess);
  const { usinas, costCenters, encarregados, apontadores } = useFormQueries();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card className="p-6">
          <div className="grid grid-cols-2 gap-4">
            <DateField form={form} />
            <SelectFields
              form={form}
              plants={usinas}
              costCenters={costCenters}
              managers={encarregados}
              pointers={apontadores}
            />
            <InputFields form={form} />
          </div>
        </Card>

        <div className="flex justify-between">
          <div className="space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleDuplicate}
            >
              Duplicar Linha
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleNewLine}
            >
              Nova Linha
            </Button>
          </div>
          <div className="space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                form.reset();
                onSuccess();
              }}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {initialData ? "Atualizar" : "Salvar"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}