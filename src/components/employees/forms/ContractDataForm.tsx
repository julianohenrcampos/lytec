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
import { Checkbox } from "@/components/ui/checkbox";
import { format, addDays } from "date-fns";
import { EmployeeFormValues } from "../types";

interface ContractDataFormProps {
  form: UseFormReturn<EmployeeFormValues>;
}

export const ContractDataForm: React.FC<ContractDataFormProps> = ({ form }) => {
  return (
    <div className="space-y-4">
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

      {form.watch("admissao") && (
        <FormItem>
          <FormLabel>Data de Férias</FormLabel>
          <FormControl>
            <Input
              type="date"
              value={format(addDays(new Date(form.watch("admissao")), 365), "yyyy-MM-dd")}
              disabled
            />
          </FormControl>
        </FormItem>
      )}

      <FormField
        control={form.control}
        name="demissao"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Data de Demissão</FormLabel>
            <FormControl>
              <Input
                type="date"
                {...field}
                onChange={(e) => {
                  field.onChange(e.target.value);
                  if (e.target.value) {
                    form.setValue("aviso", true);
                  }
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="ativo"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center space-x-2 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <FormLabel>Ativo</FormLabel>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="aviso"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center space-x-2 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled={!!form.watch("demissao")}
              />
            </FormControl>
            <FormLabel>Aviso</FormLabel>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};