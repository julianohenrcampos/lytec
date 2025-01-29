import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useFormQueries() {
  // Query for plants
  const { data: plants } = useQuery({
    queryKey: ["plants"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bd_usinas")
        .select("id, usina")
        .order("usina");
      if (error) throw error;
      return data;
    },
  });

  // Query for cost centers
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

  // Query for function IDs
  const { data: funcoes } = useQuery({
    queryKey: ["funcoes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bd_funcao")
        .select("id, nome");
      if (error) throw error;
      return data;
    },
  });

  // Query for managers (encarregados)
  const { data: managers } = useQuery({
    queryKey: ["managers", funcoes],
    queryFn: async () => {
      if (!funcoes) return [];
      
      const { data: encarregadoFunc, error: funcError } = await supabase
        .from("bd_funcao")
        .select("id")
        .ilike("nome", "encarregado")
        .maybeSingle();
      
      if (funcError) {
        console.error("Error fetching encarregado function:", funcError);
        return [];
      }
      
      if (!encarregadoFunc) {
        console.warn("Função 'encarregado' não encontrada");
        return [];
      }

      const { data, error } = await supabase
        .from("bd_rhasfalto")
        .select("id, nome")
        .eq("funcao_id", encarregadoFunc.id)
        .order("nome");

      if (error) throw error;
      return data || [];
    },
    enabled: !!funcoes,
  });

  // Query for pointers (apontadores)
  const { data: pointers } = useQuery({
    queryKey: ["pointers", funcoes],
    queryFn: async () => {
      if (!funcoes) return [];
      
      const { data: apontadorFunc, error: funcError } = await supabase
        .from("bd_funcao")
        .select("id")
        .ilike("nome", "apontador")
        .maybeSingle();
      
      if (funcError) {
        console.error("Error fetching apontador function:", funcError);
        return [];
      }
      
      if (!apontadorFunc) {
        console.warn("Função 'apontador' não encontrada");
        return [];
      }

      const { data, error } = await supabase
        .from("bd_rhasfalto")
        .select("id, nome")
        .eq("funcao_id", apontadorFunc.id)
        .order("nome");

      if (error) throw error;
      return data || [];
    },
    enabled: !!funcoes,
  });

  return {
    plants: plants || [],
    costCenters: costCenters || [],
    managers: managers || [],
    pointers: pointers || [],
  };
}