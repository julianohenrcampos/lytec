import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { UseFormReturn } from "react-hook-form";
import type { PermissionFormValues } from "../schema";

interface PermissionLevelFieldProps {
  form: UseFormReturn<PermissionFormValues>;
}

export function PermissionLevelField({ form }: PermissionLevelFieldProps) {
  return (
    <FormField
      control={form.control}
      name="permissao_usuario"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Nível de Permissão</FormLabel>
          <FormControl>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o nível de permissão" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Administrador</SelectItem>
                <SelectItem value="rh">RH</SelectItem>
                <SelectItem value="transporte">Transporte</SelectItem>
                <SelectItem value="logistica">Logística</SelectItem>
                <SelectItem value="motorista">Motorista</SelectItem>
                <SelectItem value="operador">Operador</SelectItem>
                <SelectItem value="apontador">Apontador</SelectItem>
                <SelectItem value="encarregado">Encarregado</SelectItem>
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}