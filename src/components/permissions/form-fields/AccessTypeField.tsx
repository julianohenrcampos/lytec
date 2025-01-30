import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { UseFormReturn } from "react-hook-form";
import type { PermissionFormValues } from "../schema";

interface AccessTypeFieldProps {
  form: UseFormReturn<PermissionFormValues>;
}

export function AccessTypeField({ form }: AccessTypeFieldProps) {
  return (
    <FormField
      control={form.control}
      name="acesso"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Acesso</FormLabel>
          <FormControl>
            <Select
              onValueChange={(value) => field.onChange(value === "true")}
              defaultValue={field.value?.toString()}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de acesso" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Permitido</SelectItem>
                <SelectItem value="false">Negado</SelectItem>
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}