import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { PlantFormValues } from "./schema";

interface FormFieldsProps {
  form: UseFormReturn<PlantFormValues>;
}

export function FormFields({ form }: FormFieldsProps) {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="usina"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome da Usina</FormLabel>
            <FormControl>
              <Input placeholder="Digite o nome da usina" {...field} />
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
              <Input placeholder="Digite o endereço" {...field} value={field.value || ""} />
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
            <FormLabel>Produção Total</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="Digite a produção total"
                step="0.01"
                min="0"
                onChange={(e) => {
                  const value = e.target.value ? parseFloat(e.target.value) : null;
                  field.onChange(value);
                }}
                value={field.value === null ? "" : field.value}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}