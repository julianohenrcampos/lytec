import { useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { FormValues, MassRequest } from "../types";

interface UseFormSubmitProps {
  initialData?: MassRequest | null;
  onSuccess: () => void;
}

export function useFormSubmit({ initialData, onSuccess }: UseFormSubmitProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      if (!values.streets.length) {
        throw new Error("Adicione pelo menos uma rua à requisição");
      }

      // First create the main request using the first street
      const firstStreet = values.streets[0];
      const area = firstStreet.largura * firstStreet.comprimento;
      const peso = area * firstStreet.espessura * 2.4;

      const { data: requestData, error: requestError } = await supabase
        .from("bd_requisicao")
        .insert([
          {
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
          },
        ])
        .select()
        .single();

      if (requestError) throw requestError;

      // Then create all additional streets
      if (values.streets.length > 1) {
        const streetsToInsert = values.streets.slice(1).map(street => ({
          requisicao_id: requestData.id,
          logradouro: street.logradouro,
          bairro: street.bairro,
          largura: street.largura,
          comprimento: street.comprimento,
          espessura: street.espessura,
          traco: street.traco,
          ligante: street.ligante,
          area: street.largura * street.comprimento,
          peso: street.largura * street.comprimento * street.espessura * 2.4,
        }));

        const { error: streetsError } = await supabase
          .from("bd_ruas_requisicao")
          .insert(streetsToInsert);

        if (streetsError) throw streetsError;
      }

      return requestData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mass-requests"] });
      onSuccess();
      toast({
        title: "Requisição criada com sucesso",
      });
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

  const updateMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      if (!initialData) throw new Error("No request selected for editing");
      if (!values.streets.length) {
        throw new Error("Adicione pelo menos uma rua à requisição");
      }

      // Update main request with first street data
      const firstStreet = values.streets[0];
      const area = firstStreet.largura * firstStreet.comprimento;
      const peso = area * firstStreet.espessura * 2.4;

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
          traco: firstStreet.traco,
          ligante: firstStreet.ligante,
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

      // Insert new streets (excluding the first one which is in the main request)
      if (values.streets.length > 1) {
        const streetsToInsert = values.streets.slice(1).map(street => ({
          requisicao_id: initialData.id,
          logradouro: street.logradouro,
          bairro: street.bairro,
          largura: street.largura,
          comprimento: street.comprimento,
          espessura: street.espessura,
          traco: street.traco,
          ligante: street.ligante,
          area: street.largura * street.comprimento,
          peso: street.largura * street.comprimento * street.espessura * 2.4,
        }));

        const { error: streetsError } = await supabase
          .from("bd_ruas_requisicao")
          .insert(streetsToInsert);

        if (streetsError) throw streetsError;
      }

      return requestData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mass-requests"] });
      onSuccess();
      toast({
        title: "Requisição atualizada com sucesso",
      });
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

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      if (initialData) {
        await updateMutation.mutateAsync(values);
      } else {
        await createMutation.mutateAsync(values);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    onSubmit,
    isSubmitting,
  };
}