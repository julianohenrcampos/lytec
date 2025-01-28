import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { FormValues, MassRequest } from "../types";
import { calculateStreetMetrics } from "../utils/calculations";

export function useUpdateMassRequest(initialData: MassRequest | null, onSuccess?: () => void) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: FormValues) => {
      if (!initialData) throw new Error("No request selected for editing");
      if (!values.streets.length) {
        throw new Error("Adicione pelo menos uma rua à requisição");
      }

      const firstStreet = values.streets[0];
      const { area, peso } = calculateStreetMetrics(firstStreet);

      // Update the main request
      const { data: requestData, error: requestError } = await supabase
        .from("bd_requisicao")
        .update({
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
          traco: values.traco,
          ligante: values.ligante,
        })
        .eq("id", initialData.id)
        .select()
        .single();

      if (requestError) throw requestError;

      // Delete existing streets
      const { error: deleteError } = await supabase
        .from("bd_ruas_requisicao")
        .delete()
        .eq("requisicao_id", initialData.id);

      if (deleteError) throw deleteError;

      // Insert all streets, including the first one
      const streetsToInsert = values.streets.map(street => {
        const metrics = calculateStreetMetrics(street);
        return {
          requisicao_id: initialData.id,
          logradouro: street.logradouro,
          bairro: street.bairro,
          largura: street.largura,
          comprimento: street.comprimento,
          espessura: street.espessura,
          traco: street.traco || values.traco,
          ligante: street.ligante || values.ligante,
          area: metrics.area,
          peso: metrics.peso,
        };
      });

      const { error: streetsError } = await supabase
        .from("bd_ruas_requisicao")
        .insert(streetsToInsert);

      if (streetsError) throw streetsError;

      return requestData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mass-requests"] });
      toast({ title: "Requisição atualizada com sucesso" });
      onSuccess?.();
    },
    onError: (error: Error) => {
      console.error("Error updating mass request:", error);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar requisição",
        description: error.message,
      });
    },
  });
}