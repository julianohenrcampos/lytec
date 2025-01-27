import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PlantFormValues } from "./schema";

interface UseFormSubmitProps {
  initialData?: {
    id: string;
    usina: string;
    endereco: string | null;
    producao_total: number | null;
  };
  onSuccess: () => void;
}

export function useFormSubmit({ initialData, onSuccess }: UseFormSubmitProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (data: PlantFormValues) => {
    try {
      setIsSubmitting(true);
      
      if (initialData?.id) {
        const { error } = await supabase
          .from("bd_usinas")
          .update({
            usina: data.usina,
            endereco: data.endereco || null,
            producao_total: data.producao_total,
          })
          .eq("id", initialData.id);

        if (error) throw error;
        toast({ title: "Usina atualizada com sucesso!" });
      } else {
        const { error } = await supabase
          .from("bd_usinas")
          .insert({
            usina: data.usina,
            endereco: data.endereco || null,
            producao_total: data.producao_total,
          });

        if (error) throw error;
        toast({ title: "Usina cadastrada com sucesso!" });
      }
      
      onSuccess();
    } catch (error: any) {
      if (error?.code === "23505") {
        toast({
          variant: "destructive",
          title: "Erro ao salvar",
          description: "Uma usina com este nome já existe.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Erro ao salvar",
          description: "Ocorreu um erro ao salvar a usina.",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    handleSubmit,
  };
}