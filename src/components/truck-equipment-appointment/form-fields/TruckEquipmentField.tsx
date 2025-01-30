import { UseFormReturn } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TruckEquipmentFieldProps {
  form: UseFormReturn<any>;
}

export function TruckEquipmentField({ form }: TruckEquipmentFieldProps) {
  const { data: trucks } = useQuery({
    queryKey: ["trucks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bd_caminhaoequipamento")
        .select("*, frota:frota_id(frota, numero)")
        .order("created_at");
      if (error) throw error;
      return data;
    },
  });

  return (
    <FormField
      control={form.control}
      name="caminhao_equipamento_id"
      rules={{ required: "Caminhão/Equipamento é obrigatório" }}
      render={({ field }) => (
        <FormItem className="mb-4">
          <FormLabel>Caminhão/Equipamento</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o caminhão/equipamento" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {trucks?.map((truck) => (
                <SelectItem key={truck.id} value={truck.id}>
                  {`${truck.frota?.frota} ${truck.frota?.numero} - ${truck.modelo}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}