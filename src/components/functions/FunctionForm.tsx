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

interface Function {
  id: string;
  nome: string;
  created_at: string;
}

interface FunctionFormProps {
  editingFunction: Function | null;
  onSuccess: () => void;
}

interface FormValues {
  nome: string;
}

export function FunctionForm({ editingFunction, onSuccess }: FunctionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    defaultValues: {
      nome: editingFunction?.nome || "",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const { data, error } = await supabase
        .from("bd_funcao")
        .insert([{ nome: values.nome }])
        .select()
        .single();

      if (error) {
        if (error.code === "23505") {
          throw new Error("Uma função com este nome já existe");
        }
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["functions"] });
      form.reset();
      onSuccess();
      toast({
        title: "Função criada com sucesso",
        variant: "default",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao criar função",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      if (!editingFunction) throw new Error("No function selected for editing");

      const { data, error } = await supabase
        .from("bd_funcao")
        .update({ nome: values.nome })
        .eq("id", editingFunction.id)
        .select()
        .single();

      if (error) {
        if (error.code === "23505") {
          throw new Error("Uma função com este nome já existe");
        }
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["functions"] });
      form.reset();
      onSuccess();
      toast({
        title: "Função atualizada com sucesso",
        variant: "default",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao atualizar função",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      if (editingFunction) {
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
          rules={{ required: "O nome da função é obrigatório" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome da Função</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Digite o nome da função" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex space-x-2">
          <Button type="submit" disabled={isSubmitting}>
            {editingFunction ? "Atualizar" : "Criar"} Função
          </Button>
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
        </div>
      </form>
    </Form>
  );
}