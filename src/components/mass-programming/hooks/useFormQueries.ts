import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useFormQueries() {
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

  const { data: funcoes } = useQuery({
    queryKey: ["funcoes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bd_funcao")
        .select("id, nome")
        .order("nome");

      if (error) throw error;
      return data;
    },
  });

  const { data: encarregados } = useQuery({
    queryKey: ["encarregados", funcoes],
    enabled: !!funcoes,
    queryFn: async () => {
      console.log("Fetching encarregado function...");
      const { data: encarregadoFunc, error: funcError } = await supabase
        .from("bd_funcao")
        .select("id")
        .ilike("nome", "%encarregado%")
        .maybeSingle();

      if (funcError) {
        console.error("Error fetching encarregado function:", funcError);
        return [];
      }

      if (!encarregadoFunc) {
        console.warn("Função 'encarregado' não encontrada");
        return [];
      }

      console.log("Found encarregado function:", encarregadoFunc);

      const { data: employees, error: empError } = await supabase
        .from("bd_rhasfalto")
        .select("id, nome")
        .eq("funcao_id", encarregadoFunc.id)
        .order("nome");

      if (empError) {
        console.error("Error fetching encarregados:", empError);
        return [];
      }

      return employees || [];
    },
  });

  const { data: apontadores } = useQuery({
    queryKey: ["apontadores", funcoes],
    enabled: !!funcoes,
    queryFn: async () => {
      console.log("Fetching apontador function...");
      const { data: apontadorFunc, error: funcError } = await supabase
        .from("bd_funcao")
        .select("id")
        .ilike("nome", "%apontador%")
        .maybeSingle();

      if (funcError) {
        console.error("Error fetching apontador function:", funcError);
        return [];
      }

      if (!apontadorFunc) {
        console.warn("Função 'apontador' não encontrada");
        return [];
      }

      console.log("Found apontador function:", apontadorFunc);

      const { data: employees, error: empError } = await supabase
        .from("bd_rhasfalto")
        .select("id, nome")
        .eq("funcao_id", apontadorFunc.id)
        .order("nome");

      if (empError) {
        console.error("Error fetching apontadores:", empError);
        return [];
      }

      return employees || [];
    },
  });

  const { data: usinas } = useQuery({
    queryKey: ["usinas"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bd_usinas")
        .select("id, usina")
        .order("usina");

      if (error) throw error;
      return data;
    },
  });

  return {
    costCenters: costCenters || [],
    funcoes: funcoes || [],
    encarregados: encarregados || [],
    apontadores: apontadores || [],
    usinas: usinas || [],
  };
}