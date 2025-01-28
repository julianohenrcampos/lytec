import React from "react";
import { UseFormReturn } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmployeeFormValues } from "../types";

interface ProfessionalInfoFormProps {
  form: UseFormReturn<EmployeeFormValues>;
}

export const ProfessionalInfoForm: React.FC<ProfessionalInfoFormProps> = ({ form }) => {
  const { data: funcoes } = useQuery({
    queryKey: ["funcoes"],
    queryFn: async () => {
      const { data } = await supabase.from("bd_funcao").select("*");
      return data || [];
    },
  });

  const { data: centrosCusto } = useQuery({
    queryKey: ["centrosCusto"],
    queryFn: async () => {
      const { data } = await supabase.from("bd_centrocusto").select("*");
      return data || [];
    },
  });

  const { data: empresasProprietarias } = useQuery({
    queryKey: ["empresasProprietarias"],
    queryFn: async () => {
      const { data } = await supabase.from("bd_empresa_proprietaria").select("*");
      return data || [];
    },
  });

  const { data: equipes } = useQuery({
    queryKey: ["equipes"],
    queryFn: async () => {
      const { data } = await supabase.from("bd_equipe").select("*");
      return data || [];
    },
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="funcao_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Função</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma função" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {funcoes?.map((funcao) => (
                  <SelectItem key={funcao.id} value={funcao.id}>
                    {funcao.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="centro_custo_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Centro de Custo</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um centro de custo" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {centrosCusto?.map((centro) => (
                  <SelectItem key={centro.id} value={centro.id}>
                    {centro.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="empresa_proprietaria_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Empresa Proprietária</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma empresa proprietária" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {empresasProprietarias?.map((empresa) => (
                  <SelectItem key={empresa.id} value={empresa.id}>
                    {empresa.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="equipe_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Equipe</FormLabel>
            <Select onValueChange={field.onChange} value={field.value || ""}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma equipe" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {equipes?.map((equipe) => (
                  <SelectItem key={equipe.id} value={equipe.id}>
                    {equipe.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};