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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { EmployeeFormValues } from "../types";
import type { TablesInsert } from "@/integrations/supabase/types";

type Employee = TablesInsert<"bd_rhasfalto">;

interface PersonalDataFormProps {
  form: UseFormReturn<EmployeeFormValues>;
  onSubmit: (data: Partial<Employee>) => void;
  initialData: Partial<Employee>;
}

export const PersonalDataForm: React.FC<PersonalDataFormProps> = ({ form, onSubmit, initialData }) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="nome"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="cpf"
        render={({ field }) => (
          <FormItem>
            <FormLabel>CPF</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

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
        name="genero"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Gênero</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={(value) => field.onChange(value === "true")}
                value={field.value ? "true" : "false"}
                className="flex space-x-4"
              >
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <RadioGroupItem value="true" />
                  </FormControl>
                  <FormLabel className="font-normal">
                    Masculino
                  </FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <RadioGroupItem value="false" />
                  </FormControl>
                  <FormLabel className="font-normal">
                    Feminino
                  </FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="endereco"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Endereço</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="imagem"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Imagem</FormLabel>
            <FormControl>
              <Input type="file" onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  // TODO: Implement file upload to Supabase storage
                  field.onChange(file.name);
                }
              }} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
