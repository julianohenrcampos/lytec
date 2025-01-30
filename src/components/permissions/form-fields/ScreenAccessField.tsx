import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
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
      name="telas"
      render={() => (
        <FormItem>
          <FormLabel>Telas</FormLabel>
          <FormControl>
            <div className="grid grid-cols-2 gap-4 max-h-[300px] overflow-y-auto p-2">
              {availableScreens.map((screen) => (
                <FormField
                  key={screen.value}
                  control={form.control}
                  name={`telas.${screen.value}`}
                  render={({ field }) => (
                    <FormItem
                      key={screen.value}
                      className="flex flex-row items-start space-x-3 space-y-0"
                    >
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm font-normal">
                          {screen.label}
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}