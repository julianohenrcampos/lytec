import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { UseFormReturn } from "react-hook-form";
import type { PermissionFormValues } from "../schema";

interface PermissionLevelFieldProps {
  form: UseFormReturn<PermissionFormValues>;
}

export function PermissionLevelField({ form }: PermissionLevelFieldProps) {
  const permissionLevels = [
    { value: "admin", label: "Administrador" },
    { value: "rh", label: "RH" },
    { value: "transporte", label: "Transporte" },
    { value: "logistica", label: "Logística" },
    { value: "planejamento", label: "Planejamento" },
    { value: "motorista", label: "Motorista" },
    { value: "operador", label: "Operador" },
    { value: "apontador", label: "Apontador" },
    { value: "encarregado", label: "Encarregado" },
    { value: "engenheiro", label: "Engenheiro" },
    { value: "balanca", label: "Balança" },
  ];

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
                {permissionLevels.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    {level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}