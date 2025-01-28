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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { EmployeeFormValues } from "../types";

interface AdditionalInfoFormProps {
  form: UseFormReturn<EmployeeFormValues>;
}

export const AdditionalInfoForm: React.FC<AdditionalInfoFormProps> = ({ form }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        name="escolaridade"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Escolaridade</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a escolaridade" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="Fundamental">Fundamental</SelectItem>
                <SelectItem value="Médio">Médio</SelectItem>
                <SelectItem value="Técnico">Técnico</SelectItem>
                <SelectItem value="Superior">Superior</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="genero"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Gênero</FormLabel>
            <Select 
              onValueChange={(value) => field.onChange(value === "true")} 
              value={field.value ? "true" : "false"}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o gênero" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="true">Masculino</SelectItem>
                <SelectItem value="false">Feminino</SelectItem>
              </SelectContent>
            </Select>
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