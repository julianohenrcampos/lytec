import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { FormValues, SupabaseValues } from "../types";

export function useFormLogic(initialData: any, onSuccess: () => void) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    defaultValues: initialData ? {
      ...initialData,
      data_entrega: new Date(initialData.data_entrega)
    } : {
      data_entrega: new Date(),
      tipo_lancamento: "",
      usina: "",
      centro_custo_id: "",
      logradouro: "",
      encarregado: "",
      apontador: "",
      caminhao: "",
      volume: 0,
    },
  });

  const createMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const supabaseValues: SupabaseValues = {
        ...values,
        data_entrega: format(values.data_entrega, 'yyyy-MM-dd')
      };

      const { data, error } = await supabase
        .from("bd_programacaomassa")
        .insert([supabaseValues])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["massProgramming"] });
      form.reset();
      onSuccess();
      toast({
        title: "Programação criada com sucesso",
        variant: "default",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao criar programação",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      if (!initialData) throw new Error("No program selected for editing");

      const supabaseValues: SupabaseValues = {
        ...values,
        data_entrega: format(values.data_entrega, 'yyyy-MM-dd')
      };

      const { data, error } = await supabase
        .from("bd_programacaomassa")
        .update(supabaseValues)
        .eq("id", initialData.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["massProgramming"] });
      form.reset();
      onSuccess();
      toast({
        title: "Programação atualizada com sucesso",
        variant: "default",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao atualizar programação",
        description: error.message,
        variant: "destructive",
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

  const handleDuplicate = () => {
    const currentValues = form.getValues();
    form.reset({
      ...currentValues,
      caminhao: "",
      volume: 0,
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
      volume: 0,
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