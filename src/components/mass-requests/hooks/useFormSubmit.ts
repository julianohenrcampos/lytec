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
      // First create the main request
      const { data: requestData, error: requestError } = await supabase
        .from("bd_requisicao")
        .insert([
          {
            centro_custo: values.centro_custo,
            diretoria: values.diretoria,
            gerencia: values.gerencia,
            engenheiro: values.engenheiro,
            data: format(values.data, "yyyy-MM-dd"),
            ligante: values.ligante,
            // Use the first street as the main request data
            logradouro: values.streets[0].logradouro,
            bairro: values.streets[0].bairro,
            largura: values.streets[0].largura,
            comprimento: values.streets[0].comprimento,
            espessura: values.streets[0].espessura,
            area: values.streets[0].largura * values.streets[0].comprimento,
            peso: values.streets[0].largura * values.streets[0].comprimento * values.streets[0].espessura * 2.4,
          },
        ])
        .select()
        .single();

      if (requestError) throw requestError;

      // Then create all the streets
      if (values.streets.length > 1) {
        const streetsToInsert = values.streets.slice(1).map(street => ({
          requisicao_id: requestData.id,
          logradouro: street.logradouro,
          bairro: street.bairro,
          largura: street.largura,
          comprimento: street.comprimento,
          espessura: street.espessura,
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

      // Update main request
      const { data: requestData, error: requestError } = await supabase
        .from("bd_requisicao")
        .update({
          centro_custo: values.centro_custo,
          diretoria: values.diretoria,
          gerencia: values.gerencia,
          engenheiro: values.engenheiro,
          data: format(values.data, "yyyy-MM-dd"),
          ligante: values.ligante,
          logradouro: values.streets[0].logradouro,
          bairro: values.streets[0].bairro,
          largura: values.streets[0].largura,
          comprimento: values.streets[0].comprimento,
          espessura: values.streets[0].espessura,
          area: values.streets[0].largura * values.streets[0].comprimento,
          peso: values.streets[0].largura * values.streets[0].comprimento * values.streets[0].espessura * 2.4,
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

      // Insert new streets
      if (values.streets.length > 1) {
        const streetsToInsert = values.streets.slice(1).map(street => ({
          requisicao_id: initialData.id,
          logradouro: street.logradouro,
          bairro: street.bairro,
          largura: street.largura,
          comprimento: street.comprimento,
          espessura: street.espessura,
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