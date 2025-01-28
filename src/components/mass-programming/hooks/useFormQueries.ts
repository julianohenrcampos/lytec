import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useFormQueries() {
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

  // First, get the function IDs
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

  // Then use the function IDs to get managers
  const { data: managers } = useQuery({
    queryKey: ["managers", funcoes],
    queryFn: async () => {
      if (!funcoes) return [];
      const encarregadoFunc = funcoes.find(f => f.nome.toLowerCase() === "encarregado");
      if (!encarregadoFunc) return [];

      const { data, error } = await supabase
        .from("bd_rhasfalto")
        .select("id, nome")
        .eq("funcao_id", encarregadoFunc.id)
        .order("nome");
      if (error) throw error;
      return data;
    },
    enabled: !!funcoes,
  });

  // And use the function IDs to get pointers
  const { data: pointers } = useQuery({
    queryKey: ["pointers", funcoes],
    queryFn: async () => {
      if (!funcoes) return [];
      const apontadorFunc = funcoes.find(f => f.nome.toLowerCase() === "apontador");
      if (!apontadorFunc) return [];

      const { data, error } = await supabase
        .from("bd_rhasfalto")
        .select("id, nome")
        .eq("funcao_id", apontadorFunc.id)
        .order("nome");
      if (error) throw error;
      return data;
    },
    enabled: !!funcoes,
  });

  return {
    plants,
    costCenters,
    managers,
    pointers,
  };
}