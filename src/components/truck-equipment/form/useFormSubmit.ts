import { useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { FormValues } from "./types";
import { useImageUpload } from "./useImageUpload";
import type { TruckEquipment } from "../types";

interface UseFormSubmitProps {
  initialData?: TruckEquipment | null;
  onSuccess?: () => void;
}

export function useFormSubmit({ initialData, onSuccess }: UseFormSubmitProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { handleImageUpload } = useImageUpload();

  const createMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      console.log("Creating new truck/equipment:", values);
      let imageUrl = null;
      
      if (values.imagem instanceof FileList && values.imagem.length > 0) {
        imageUrl = await handleImageUpload(values.imagem[0]);
      }

      const { data, error } = await supabase
        .from("bd_caminhaoequipamento")
        .insert([{
          frota_id: values.frota_id,
          tipo: values.tipo,
          modelo: values.modelo,
          ano: values.ano,
          capacidade: values.capacidade,
          proprietario: values.proprietario,
          descricao: values.descricao,
          placa: values.placa,
          aluguel: values.aluguel,
          imagem: imageUrl,
        }])
        .select()
        .single();

      if (error) {
        console.error("Error creating truck/equipment:", error);
        if (error.code === '23505' && error.message.includes('unique_placa_idx')) {
          throw new Error('Esta placa já está cadastrada no sistema.');
        }
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trucks-equipment"] });
      toast({ title: "Item cadastrado com sucesso!" });
      onSuccess?.();
    },
    onError: (error) => {
      console.error("Mutation error:", error);
      toast({
        variant: "destructive",
        title: "Erro ao cadastrar item",
        description: error instanceof Error ? error.message : "Erro desconhecido",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      console.log("Updating truck/equipment:", values);
      let imageUrl = initialData?.imagem;
      
      if (values.imagem instanceof FileList && values.imagem.length > 0) {
        imageUrl = await handleImageUpload(values.imagem[0]);
      }

      const { data, error } = await supabase
        .from("bd_caminhaoequipamento")
        .update({
          frota_id: values.frota_id,
          tipo: values.tipo,
          modelo: values.modelo,
          ano: values.ano,
          capacidade: values.capacidade,
          proprietario: values.proprietario,
          descricao: values.descricao,
          placa: values.placa,
          aluguel: values.aluguel,
          imagem: imageUrl,
        })
        .eq("id", initialData?.id)
        .select()
        .single();

      if (error) {
        console.error("Error updating truck/equipment:", error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trucks-equipment"] });
      toast({ title: "Item atualizado com sucesso!" });
      onSuccess?.();
    },
    onError: (error) => {
      console.error("Mutation error:", error);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar item",
        description: error instanceof Error ? error.message : "Erro desconhecido",
      });
    },
  });

  return {
    createMutation,
    updateMutation,
  };
}