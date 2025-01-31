import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Plus } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { permissionFormSchema, type PermissionFormValues } from "./schema";
import { usePermissionForm } from "./usePermissionForm";
import { PermissionFormFields } from "./PermissionFormFields";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

export function PermissionForm() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const form = useForm<PermissionFormValues>({
    resolver: zodResolver(permissionFormSchema),
    defaultValues: {
      telas: {},
      acesso: true,
    },
  });

  const { users, isLoadingUsers, createPermission } = usePermissionForm({
    onSuccess: () => {
      toast({
        title: "Sucesso",
        description: "Permissões atualizadas com sucesso",
      });
      setOpen(false);
      form.reset();
    },
  });

  const handleSubmit = async (values: PermissionFormValues) => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para gerenciar permissões",
        variant: "destructive",
      });
      return;
    }

    if (!values.usuario_id) {
      toast({
        title: "Erro",
        description: "Selecione um usuário",
        variant: "destructive",
      });
      return;
    }

    try {
      // Get selected screens (true values)
      const selectedScreens = Object.entries(values.telas)
        .filter(([_, isSelected]) => isSelected)
        .map(([screen]) => screen);

      // Create a "none" permission entry to store the user's permission level
      await createPermission.mutateAsync({
        usuario_id: values.usuario_id,
        tela: "none",
        acesso: false,
        permissao_usuario: values.permissao_usuario,
      });

      // If there are selected screens, create permissions for them
      if (selectedScreens.length > 0) {
        const promises = selectedScreens.map(screen => 
          createPermission.mutateAsync({
            usuario_id: values.usuario_id,
            tela: screen,
            acesso: values.acesso,
            permissao_usuario: values.permissao_usuario,
          })
        );
        await Promise.all(promises);
      }
    } catch (error) {
      console.error('Error managing permissions:', error);
      toast({
        title: "Erro",
        description: "Erro ao gerenciar permissões",
        variant: "destructive",
      });
    }
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
            <PermissionFormFields
              form={form}
              users={users}
              isLoadingUsers={isLoadingUsers}
            />
            <Button
              type="submit"
              className="w-full"
              disabled={createPermission.isPending}
            >
              {createPermission.isPending ? "Salvando..." : "Criar Permissão"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}