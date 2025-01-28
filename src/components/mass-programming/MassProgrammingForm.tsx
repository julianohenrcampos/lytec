import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useFormLogic } from "./hooks/useFormLogic";
import { useFormQueries } from "./hooks/useFormQueries";
import { DateField } from "./form-fields/DateField";
import { SelectFields } from "./form-fields/SelectFields";
import { InputFields } from "./form-fields/InputFields";
import { MassProgrammingFormProps } from "./types";

export function MassProgrammingForm({ initialData, onSuccess }: MassProgrammingFormProps) {
  const { form, isSubmitting, onSubmit, handleDuplicate, handleNewLine } = useFormLogic(initialData, onSuccess);
  const { plants, costCenters, managers, pointers } = useFormQueries();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <DateField form={form} />
          <SelectFields
            form={form}
            plants={plants}
            costCenters={costCenters}
            managers={managers}
            pointers={pointers}
          />
          <InputFields form={form} />
        </div>

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
              onClick={() => form.reset()}
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