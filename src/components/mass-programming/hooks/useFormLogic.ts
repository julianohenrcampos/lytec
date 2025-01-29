import { useState } from "react";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { FormValues, SupabaseValues } from "../types";
import { useLocation } from "react-router-dom";

export function useFormLogic(initialData: any, onSuccess: () => void) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const location = useLocation();
  const requestData = location.state;

  const form = useForm<FormValues>({
    defaultValues: initialData || {
      data_entrega: new Date(),
      tipo_lancamento: "",
      usina: "",
      centro_custo_id: requestData?.centro_custo_id || "",
      logradouro: requestData?.logradouro || "",
      encarregado: "",
      apontador: "",
      caminhao: "",
      volume: requestData?.volume || undefined,
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      const supabaseValues: SupabaseValues = {
        ...values,
        data_entrega: values.data_entrega.toISOString(),
        requisicao_id: requestData?.requisicao_id,
      };

      if (initialData) {
        await supabase
          .from("bd_programacaomassa")
          .update(supabaseValues)
          .eq("id", initialData.id);
      } else {
        await supabase.from("bd_programacaomassa").insert(supabaseValues);

        // Update the quantidade_programada in bd_requisicao
        if (requestData?.requisicao_id) {
          const { data: requisicao } = await supabase
            .from("bd_requisicao")
            .select("quantidade_programada")
            .eq("id", requestData.requisicao_id)
            .single();

          await supabase
            .from("bd_requisicao")
            .update({
              quantidade_programada: (requisicao?.quantidade_programada || 0) + (values.volume || 0),
            })
            .eq("id", requestData.requisicao_id);
        }
      }

      toast({
        title: initialData
          ? "Programação atualizada com sucesso!"
          : "Programação criada com sucesso!",
      });
      onSuccess();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao salvar programação",
        description: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDuplicate = () => {
    const currentValues = form.getValues();
    form.reset({
      ...currentValues,
      data_entrega: new Date(),
    });
  };

  const handleNewLine = () => {
    form.reset({
      data_entrega: new Date(),
      tipo_lancamento: "",
      usina: "",
      centro_custo_id: "",
      logradouro: "",
      encarregado: "",
      apontador: "",
      caminhao: "",
      volume: undefined,
    });
  };

  return {
    form,
    isSubmitting,
    onSubmit,
    handleDuplicate,
    handleNewLine,
  };
}