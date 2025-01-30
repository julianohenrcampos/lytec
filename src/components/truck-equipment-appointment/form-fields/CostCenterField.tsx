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

interface CostCenterFieldProps {
  form: UseFormReturn<any>;
}

export function CostCenterField({ form }: CostCenterFieldProps) {
  const { data: costCenters } = useQuery({
    queryKey: ["costCenters"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bd_centrocusto")
        .select("*")
        .order("nome");
      if (error) throw error;
      return data;
    },
  });

  return (
    <FormField
      control={form.control}
      name="centro_custo_id"
      rules={{ required: "Centro de custo é obrigatório" }}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Centro de Custo</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o centro de custo" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {costCenters?.map((cc) => (
                <SelectItem key={cc.id} value={cc.id}>
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