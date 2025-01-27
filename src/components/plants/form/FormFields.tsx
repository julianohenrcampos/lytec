import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { PlantFormValues } from "./schema";

interface FormFieldsProps {
  form: UseFormReturn<PlantFormValues>;
}

export function FormFields({ form }: FormFieldsProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="usina"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome da Usina*</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="endereco"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Endereço</FormLabel>
            <FormControl>
              <Textarea {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="producao_total"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Produção Total (T)</FormLabel>
            <FormControl>
              <Input
                type="number"
                step="0.01"
                min="0"
                {...field}
                onChange={(e) => {
                  const value = e.target.value ? parseFloat(e.target.value) : null;
                  field.onChange(value);
                }}
                value={field.value ?? ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}