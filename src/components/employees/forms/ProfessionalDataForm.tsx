import React from "react";
import { UseFormReturn } from "react-hook-form";
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
import { useEmployeeFormData } from "../hooks/useEmployeeFormData";
import type { TablesInsert } from "@/integrations/supabase/types";

type Employee = TablesInsert<"bd_rhasfalto">;

interface ProfessionalDataFormProps {
  form: UseFormReturn<EmployeeFormValues>;
  onSubmit: (data: Partial<Employee>) => void;
  initialData: Partial<Employee>;
}

export const ProfessionalDataForm: React.FC<ProfessionalDataFormProps> = ({ form, onSubmit, initialData }) => {
  const { funcoes, centrosCusto, empresasProprietarias, equipes } = useEmployeeFormData();

  return (
    <div className="space-y-4">
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