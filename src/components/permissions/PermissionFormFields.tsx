import { useState } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { UseFormReturn } from "react-hook-form";
import type { PermissionFormValues } from "./schema";

interface PermissionFormFieldsProps {
  form: UseFormReturn<PermissionFormValues>;
  users: { id: string; nome: string; }[] | null;
  isLoadingUsers: boolean;
}

export function PermissionFormFields({ form, users, isLoadingUsers }: PermissionFormFieldsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredUsers = users?.filter(user => 
    user.nome.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <FormField
        control={form.control}
        name="usuario_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Usuário</FormLabel>
            <FormControl>
              <div className="space-y-2">
                <Input
                  placeholder="Buscar usuário..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="mb-2"
                />
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isLoadingUsers}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um usuário" />
                  </SelectTrigger>
                  <SelectContent>
                    <ScrollArea className="h-[200px]">
                      {filteredUsers?.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.nome}
                        </SelectItem>
                      ))}
                    </ScrollArea>
                  </SelectContent>
                </Select>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="permissao_usuario"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nível de Permissão</FormLabel>
            <FormControl>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o nível de permissão" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="rh">RH</SelectItem>
                  <SelectItem value="transporte">Transporte</SelectItem>
                  <SelectItem value="logistica">Logística</SelectItem>
                  <SelectItem value="motorista">Motorista</SelectItem>
                  <SelectItem value="operador">Operador</SelectItem>
                  <SelectItem value="apontador">Apontador</SelectItem>
                  <SelectItem value="encarregado">Encarregado</SelectItem>
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