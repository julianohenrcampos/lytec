import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface FormValues {
  usuario_id?: string;
  tela: string;
  acesso?: boolean;
}

export function PermissionForm() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createPermission = useMutation({
    mutationFn: async (values: FormValues) => {
      const { error } = await supabase
        .from("bd_permissoes")
        .insert({
          usuario_id: values.usuario_id,
          tela: values.tela,
          acesso: values.acesso,
        });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permissions"] });
      toast({
        title: "Permissão criada com sucesso!",
      });
      setOpen(false);
    },
    onError: (error) => {
      console.error("Error creating permission:", error);
      toast({
        title: "Erro ao criar permissão",
        description: "Tente novamente mais tarde",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (values: FormValues) => {
    createPermission.mutate(values);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nova Permissão
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova Permissão</DialogTitle>
        </DialogHeader>
        <Form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <FormField
              name="usuario_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Usuário</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um usuário" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Usuário 1</SelectItem>
                        <SelectItem value="2">Usuário 2</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              name="tela"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tela</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma tela" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dashboard">Dashboard</SelectItem>
                        <SelectItem value="employees">Funcionários</SelectItem>
                        <SelectItem value="permissions">Permissões</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              name="acesso"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Acesso</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value?.toString()}
                      onValueChange={(value) => field.onChange(value === "true")}
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
                </FormItem>
              )}
            />
            <Button 
              type="submit" 
              disabled={createPermission.isPending}
              className="w-full"
            >
              {createPermission.isPending ? "Criando..." : "Criar Permissão"}
            </Button>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  );
}