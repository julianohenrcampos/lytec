import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { UseFormReturn } from "react-hook-form";
import type { PermissionFormValues } from "../schema";

interface ScreenAccessFieldProps {
  form: UseFormReturn<PermissionFormValues>;
}

// This array should be updated whenever new routes are added
const availableScreens = [
  { value: "dashboard", label: "Dashboard" },
  { value: "employees", label: "Funcionários" },
  { value: "teams", label: "Equipes" },
  { value: "companies", label: "Empresas" },
  { value: "functions", label: "Funções" },
  { value: "cost-centers", label: "Centros de Custo" },
  { value: "fleets", label: "Frotas" },
  { value: "trucks-equipment", label: "Caminhões e Equipamentos" },
  { value: "plants", label: "Usinas" },
  { value: "mass-requests", label: "Requisições de Massa" },
  { value: "mass-programming", label: "Programação de Massa" },
  { value: "permissions", label: "Permissões" },
  { value: "profile", label: "Perfil" },
  { value: "settings", label: "Configurações" },
  { value: "inspection-checklist", label: "Checklist de Inspeção" },
  { value: "checklist-list", label: "Lista de Checklists" },
];

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
                {availableScreens.map((screen) => (
                  <SelectItem key={screen.value} value={screen.value}>
                    {screen.label}
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