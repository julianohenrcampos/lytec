import React from "react";
import { UseFormReturn } from "react-hook-form";
import { EmployeeFormValues } from "../types";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface ContractDataFormProps {
  form: UseFormReturn<EmployeeFormValues>;
  onSubmit: (values: EmployeeFormValues) => void;
  initialData?: Partial<EmployeeFormValues>;
}

export const ContractDataForm: React.FC<ContractDataFormProps> = ({
  form,
  initialData,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Dados Contratuais</h3>
        <div className="grid grid-cols-1 gap-4">
          <FormField
            control={form.control}
            name="matricula"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Matrícula</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="admissao"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data de Admissão</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="demissao"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data de Demissão</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="salario"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Salário</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
};