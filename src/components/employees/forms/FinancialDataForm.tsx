import React from "react";
import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { EmployeeFormValues } from "../types";
import type { TablesInsert } from "@/integrations/supabase/types";

type Employee = TablesInsert<"bd_rhasfalto">;

interface FinancialDataFormProps {
  form: UseFormReturn<EmployeeFormValues>;
  onSubmit: (data: Partial<Employee>) => void;
  initialData: Partial<Employee>;
}

export const FinancialDataForm: React.FC<FinancialDataFormProps> = ({ form, onSubmit, initialData }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="salario"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Salário</FormLabel>
            <FormControl>
              <Input
                type="number"
                step="0.01"
                onChange={(e) => field.onChange(Number(e.target.value))}
                value={field.value}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="insalubridade"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Insalubridade</FormLabel>
            <FormControl>
              <Input
                type="number"
                step="0.01"
                onChange={(e) => field.onChange(Number(e.target.value))}
                value={field.value}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="periculosidade"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Periculosidade</FormLabel>
            <FormControl>
              <Input
                type="number"
                step="0.01"
                onChange={(e) => field.onChange(Number(e.target.value))}
                value={field.value}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="gratificacao"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Gratificação</FormLabel>
            <FormControl>
              <Input
                type="number"
                step="0.01"
                onChange={(e) => field.onChange(Number(e.target.value))}
                value={field.value}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="adicional_noturno"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Adicional Noturno</FormLabel>
            <FormControl>
              <Input
                type="number"
                step="0.01"
                onChange={(e) => field.onChange(Number(e.target.value))}
                value={field.value}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="custo_passagem"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Custo de Passagem</FormLabel>
            <FormControl>
              <Input
                type="number"
                step="0.01"
                onChange={(e) => field.onChange(Number(e.target.value))}
                value={field.value}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="refeicao"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Refeição</FormLabel>
            <FormControl>
              <Input
                type="number"
                step="0.01"
                onChange={(e) => field.onChange(Number(e.target.value))}
                value={field.value}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="diarias"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Diárias</FormLabel>
            <FormControl>
              <Input
                type="number"
                step="0.01"
                onChange={(e) => field.onChange(Number(e.target.value))}
                value={field.value}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};