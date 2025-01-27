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
import { useFormContext } from "react-hook-form";
import { FormValues } from "../../types";

export function CostCenterField() {
  const { control } = useFormContext<FormValues>();

  const { data: costCenters } = useQuery({
    queryKey: ["costCenters"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bd_centrocusto")
        .select("id, nome")
        .order("nome");

      if (error) throw error;
      return data;
    },
  });

  return (
    <FormField
      control={control}
      name="centro_custo"
      rules={{ required: "Centro de custo é obrigatório" }}
      render={({ field }) => (
        <FormItem className="w-full">
          <FormLabel>Centro de Custo</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione um centro de custo" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {costCenters?.map((cc) => (
                <SelectItem key={cc.id} value={cc.nome}>
                  {cc.nome}
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