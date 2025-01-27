import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { FormValues } from "../types";
import { calculateStreetMetrics } from "../utils/calculations";

export function useCreateMassRequest(onSuccess?: () => void) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: FormValues) => {
      if (!values.streets.length) {
        throw new Error("Adicione pelo menos uma rua à requisição");
      }

      const firstStreet = values.streets[0];
      const { area, peso } = calculateStreetMetrics(firstStreet);

      const { data: requestData, error: requestError } = await supabase
        .from("bd_requisicao")
        .insert([{
          centro_custo: values.centro_custo,
          diretoria: values.diretoria,
          gerencia: values.gerencia,
          engenheiro: values.engenheiro,
          data: format(values.data, "yyyy-MM-dd"),
          logradouro: firstStreet.logradouro,
          bairro: firstStreet.bairro,
          largura: firstStreet.largura,
          comprimento: firstStreet.comprimento,
          espessura: firstStreet.espessura,
          area: area,
          peso: peso,
          traco: firstStreet.traco,
          ligante: firstStreet.ligante,
        }])
        .select()
        .single();

      if (requestError) throw requestError;

      if (values.streets.length > 1) {
        const streetsToInsert = values.streets.slice(1).map(street => {
          const metrics = calculateStreetMetrics(street);
          return {
            requisicao_id: requestData.id,
            logradouro: street.logradouro,
            bairro: street.bairro,
            largura: street.largura,
            comprimento: street.comprimento,
            espessura: street.espessura,
            traco: street.traco,
            ligante: street.ligante,
            area: metrics.area,
            peso: metrics.peso,
          };
        });

        const { error: streetsError } = await supabase
          .from("bd_ruas_requisicao")
          .insert(streetsToInsert);

        if (streetsError) throw streetsError;
      }

      return requestData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mass-requests"] });
      toast({ title: "Requisição criada com sucesso" });
      onSuccess?.();
    },
    onError: (error: Error) => {
      console.error("Error creating mass request:", error);
      toast({
        variant: "destructive",
        title: "Erro ao criar requisição",
        description: error.message,
      });
    },
  });
}