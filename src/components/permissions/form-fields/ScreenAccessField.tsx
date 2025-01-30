import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { UseFormReturn } from "react-hook-form";
import type { PermissionFormValues } from "../schema";

interface ScreenAccessFieldProps {
  form: UseFormReturn<PermissionFormValues>;
}

export function ScreenAccessField({ form }: ScreenAccessFieldProps) {
  return (
    <FormField
      control={form.control}
      name="tela"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Tela</FormLabel>
          <FormControl>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma tela" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dashboard">Dashboard</SelectItem>
                <SelectItem value="employees">Funcionários</SelectItem>
                <SelectItem value="permissions">Permissões</SelectItem>
                <SelectItem value="mass-requests">Requisições de Massa</SelectItem>
                <SelectItem value="mass-programming">Programação de Massa</SelectItem>
                <SelectItem value="checklist">Checklist</SelectItem>
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}