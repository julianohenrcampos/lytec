import React from "react";
import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { EmployeeFormValues } from "../types";

interface PermissionsFormProps {
  form: UseFormReturn<EmployeeFormValues>;
}

export const PermissionsForm: React.FC<PermissionsFormProps> = ({ form }) => {
  const { control } = form;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Permissões de Acesso</h3>
      <div className="grid grid-cols-2 gap-4">
        {form.getValues().permissoes?.map((permissao, index) => (
          <FormField
            key={permissao.tela}
            control={control}
            name={`permissoes.${index}.acesso`}
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="font-normal">
                  {permissao.tela.charAt(0).toUpperCase() + permissao.tela.slice(1)}
                </FormLabel>
              </FormItem>
            )}
          />
        ))}
      </div>
    </div>
  );
};