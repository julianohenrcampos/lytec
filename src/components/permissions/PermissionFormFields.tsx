import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { UseFormReturn } from "react-hook-form";
import type { PermissionFormValues } from "./schema";

interface PermissionFormFieldsProps {
  form: UseFormReturn<PermissionFormValues>;
  users: { id: string; nome: string; }[] | null;
  isLoadingUsers: boolean;
}

export function PermissionFormFields({ form, users, isLoadingUsers }: PermissionFormFieldsProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="usuario_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Usuário</FormLabel>
            <FormControl>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isLoadingUsers}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um usuário" />
                </SelectTrigger>
                <SelectContent>
                  {users?.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="tela"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tela</FormLabel>
            <FormControl>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma tela" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dashboard">Dashboard</SelectItem>
                  <SelectItem value="employees">Funcionários</SelectItem>
                  <SelectItem value="permissions">Permissões</SelectItem>
                  <SelectItem value="mass-requests">Requisições de Massa</SelectItem>
                  <SelectItem value="mass-programming">Programação de Massa</SelectItem>
                  <SelectItem value="checklist">Checklist</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="acesso"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Acesso</FormLabel>
            <FormControl>
              <Select
                onValueChange={(value) => field.onChange(value === "true")}
                defaultValue={field.value?.toString()}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo de acesso" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Permitido</SelectItem>
                  <SelectItem value="false">Negado</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}