import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { Plus } from "lucide-react";

interface FormValues {
  usuario_id?: string;
  tela?: string;
  acesso?: boolean;
}

export function PermissionForm() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const form = useForm<FormValues>();

  const createPermission = useMutation({
    mutationFn: async (values: FormValues) => {
      const { data, error } = await supabase
        .from("bd_permissoes")
        .insert([
          {
            usuario_id: values.usuario_id,
            tela: values.tela,
            acesso: values.acesso,
          },
        ])
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permissions"] });
      toast({
        title: "Sucesso",
        description: "Permissão criada com sucesso",
      });
      setOpen(false);
    },
    onError: (error) => {
      console.error("Error creating permission:", error);
      toast({
        title: "Erro",
        description: "Erro ao criar permissão",
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
        <Button variant="outline" size="icon">
          <Plus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova Permissão</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
                      </SelectContent>
                    </Select>
                  </FormControl>
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
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full"
              disabled={createPermission.isPending}
            >
              {createPermission.isPending ? "Criando..." : "Criar Permissão"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}