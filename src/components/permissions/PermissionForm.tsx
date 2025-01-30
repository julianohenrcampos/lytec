import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { Plus } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const formSchema = z.object({
  usuario_id: z.string({
    required_error: "Selecione um usuário",
  }),
  tela: z.string({
    required_error: "Selecione uma tela",
  }),
  acesso: z.boolean({
    required_error: "Selecione o tipo de acesso",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export function PermissionForm() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const { data: users, isLoading: isLoadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bd_rhasfalto")
        .select("id, nome")
        .order("nome");

      if (error) throw error;
      return data;
    },
  });

  const createPermission = useMutation({
    mutationFn: async (values: FormValues) => {
      const { data, error } = await supabase
        .from("bd_permissoes")
        .insert([{
          usuario_id: values.usuario_id,
          tela: values.tela,
          acesso: values.acesso,
        }])
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
      form.reset();
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