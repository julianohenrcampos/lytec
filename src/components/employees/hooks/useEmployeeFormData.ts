import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useEmployeeFormData = () => {
  const { data: funcoes } = useQuery({
    queryKey: ["funcoes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bd_funcao")
        .select("*")
        .order("nome");
      if (error) throw error;
      return data || [];
    },
  });

  const { data: centrosCusto } = useQuery({
    queryKey: ["centrosCusto"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bd_centrocusto")
        .select("*")
        .order("nome");
      if (error) throw error;
      return data || [];
    },
  });

  const { data: empresasProprietarias } = useQuery({
    queryKey: ["empresasProprietarias"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bd_empresa_proprietaria")
        .select("*")
        .order("nome");
      if (error) throw error;
      return data || [];
    },
  });

  const { data: equipes } = useQuery({
    queryKey: ["equipes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bd_equipe")
        .select("*")
        .order("nome");
      if (error) throw error;
      return data || [];
    },
  });

  return {
    funcoes: funcoes || [],
    centrosCusto: centrosCusto || [],
    empresasProprietarias: empresasProprietarias || [],
    equipes: equipes || [],
  };
};