import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useEmployeeFormData = () => {
  const { data: funcoes } = useQuery({
    queryKey: ["funcoes"],
    queryFn: async () => {
      const { data, error } = await supabase.from("bd_funcao").select("*");
      if (error) throw error;
      return data || [];
    },
  });

  const { data: centrosCusto } = useQuery({
    queryKey: ["centrosCusto"],
    queryFn: async () => {
      const { data, error } = await supabase.from("bd_centrocusto").select("*");
      if (error) throw error;
      return data || [];
    },
  });

  const { data: empresas } = useQuery({
    queryKey: ["empresas"],
    queryFn: async () => {
      const { data, error } = await supabase.from("bd_empresa_proprietaria").select("*");
      if (error) throw error;
      return data || [];
    },
  });

  const { data: equipes } = useQuery({
    queryKey: ["equipes"],
    queryFn: async () => {
      const { data, error } = await supabase.from("bd_equipe").select("*");
      if (error) throw error;
      return data || [];
    },
  });

  return {
    funcoes,
    centrosCusto,
    empresas,
    equipes,
  };
};