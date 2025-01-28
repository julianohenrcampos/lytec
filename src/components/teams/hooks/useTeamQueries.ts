import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useTeamQueries() {
  const useEmployeesByFunction = (functionName: string) => {
    return useQuery({
      queryKey: ["employees", functionName],
      queryFn: async () => {
        const { data: functionData } = await supabase
          .from("bd_funcao")
          .select("id")
          .eq("nome", functionName)
          .single();

        if (!functionData) return [];

        const { data, error } = await supabase
          .from("bd_rhasfalto")
          .select("id, nome")
          .eq("ativo", true)
          .eq("funcao_id", functionData.id);

        if (error) throw error;
        return data;
      },
    });
  };

  const useAllEmployees = () => {
    return useQuery({
      queryKey: ["employees"],
      queryFn: async () => {
        const { data, error } = await supabase
          .from("bd_rhasfalto")
          .select("id, nome, matricula")
          .eq("ativo", true);
        if (error) throw error;
        return data;
      },
    });
  };

  return {
    useEmployeesByFunction,
    useAllEmployees,
  };
}