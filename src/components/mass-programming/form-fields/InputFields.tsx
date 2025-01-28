import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../types";

interface InputFieldsProps {
  form: UseFormReturn<FormValues>;
}

export function InputFields({ form }: InputFieldsProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="logradouro"
        rules={{ required: "Logradouro é obrigatório" }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Logradouro</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Digite o logradouro" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="caminhao"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Caminhão</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Digite o caminhão" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="volume"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Volume (t)</FormLabel>
            <FormControl>
              <Input
                {...field}
                type="number"
                step="0.01"
                placeholder="Digite o volume"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}