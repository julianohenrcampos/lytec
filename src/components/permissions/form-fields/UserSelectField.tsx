import { useState } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { UseFormReturn } from "react-hook-form";
import type { PermissionFormValues } from "../schema";

interface UserSelectFieldProps {
  form: UseFormReturn<PermissionFormValues>;
  users: { id: string; nome: string; }[] | null;
  isLoadingUsers: boolean;
}

export function UserSelectField({ form, users, isLoadingUsers }: UserSelectFieldProps) {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredUsers = users?.filter(user => 
    user.nome.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
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
  );
}