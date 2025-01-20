import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface CostCenter {
  id: string;
  nome: string;
  created_at: string;
}

interface CostCenterFormProps {
  editingCostCenter: CostCenter | null;
  onSuccess: () => void;
}

interface FormValues {
  nome: string;
}

export function CostCenterForm({ editingCostCenter, onSuccess }: CostCenterFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    defaultValues: {
      nome: editingCostCenter?.nome || "",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const { data, error } = await supabase
        .from("bd_centrocusto")
        .insert([{ nome: values.nome }])
        .select()
        .single();

      if (error) {
        if (error.code === "23505") {
          throw new Error("Um centro de custo com este nome já existe");
        }
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["costCenters"] });
      form.reset();
      onSuccess();
      toast({
        title: "Centro de custo criado com sucesso",
        variant: "default",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao criar centro de custo",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      if (!editingCostCenter) throw new Error("No cost center selected for editing");

      const { data, error } = await supabase
        .from("bd_centrocusto")
        .update({ nome: values.nome })
        .eq("id", editingCostCenter.id)
        .select()
        .single();

      if (error) {
        if (error.code === "23505") {
          throw new Error("Um centro de custo com este nome já existe");
        }
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["costCenters"] });
      form.reset();
      onSuccess();
      toast({
        title: "Centro de custo atualizado com sucesso",
        variant: "default",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao atualizar centro de custo",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      if (editingCostCenter) {
        await updateMutation.mutateAsync(values);
      } else {
        await createMutation.mutateAsync(values);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    form.reset();
    onSuccess();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="nome"
          rules={{ required: "O nome do centro de custo é obrigatório" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Centro de Custo</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Digite o nome do centro de custo" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex space-x-2">
          <Button type="submit" disabled={isSubmitting}>
            {editingCostCenter ? "Atualizar" : "Criar"} Centro de Custo
          </Button>
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
        </div>
      </form>
    </Form>
  );
}