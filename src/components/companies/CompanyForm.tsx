import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
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
import { useToast } from "@/hooks/use-toast";

const companySchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  cnpj: z
    .string()
    .regex(/^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$/, "CNPJ inválido")
    .optional()
    .or(z.literal("")),
});

type CompanyFormValues = z.infer<typeof companySchema>;

interface CompanyFormProps {
  initialData?: {
    id: string;
    nome: string;
    cnpj: string | null;
  };
  onSuccess?: () => void;
}

export const CompanyForm = ({ initialData, onSuccess }: CompanyFormProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      nome: initialData?.nome || "",
      cnpj: initialData?.cnpj || "",
    },
  });

  const createCompany = useMutation({
    mutationFn: async (values: CompanyFormValues) => {
      const { data, error } = await supabase
        .from("bd_empresa_proprietaria")
        .insert([
          {
            nome: values.nome,
            cnpj: values.cnpj || null,
          },
        ])
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      toast({
        title: "Empresa cadastrada com sucesso!",
      });
      form.reset();
      onSuccess?.();
    },
    onError: (error: any) => {
      console.error("Error creating company:", error);
      toast({
        variant: "destructive",
        title: "Erro ao cadastrar empresa",
        description: error.message,
      });
    },
  });

  const updateCompany = useMutation({
    mutationFn: async (values: CompanyFormValues) => {
      const { data, error } = await supabase
        .from("bd_empresa_proprietaria")
        .update({
          nome: values.nome,
          cnpj: values.cnpj || null,
        })
        .eq("id", initialData?.id)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      toast({
        title: "Empresa atualizada com sucesso!",
      });
      onSuccess?.();
    },
    onError: (error: any) => {
      console.error("Error updating company:", error);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar empresa",
        description: error.message,
      });
    },
  });

  const onSubmit = (values: CompanyFormValues) => {
    if (initialData) {
      updateCompany.mutate(values);
    } else {
      createCompany.mutate(values);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="nome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome da Empresa</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cnpj"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CNPJ</FormLabel>
              <FormControl>
                <Input {...field} placeholder="00.000.000/0000-00" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              form.reset();
              onSuccess?.();
            }}
          >
            Cancelar
          </Button>
          <Button type="submit">
            {initialData ? "Atualizar" : "Salvar"}
          </Button>
        </div>
      </form>
    </Form>
  );
};