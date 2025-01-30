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

export function PermissionForm() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<PermissionFormValues>({
    resolver: zodResolver(permissionFormSchema),
    defaultValues: {
      telas: {},
      acesso: true,
    },
  });

  const { users, isLoadingUsers, createPermission } = usePermissionForm({
    onSuccess: () => {
      setOpen(false);
      form.reset();
    },
  });

  const handleSubmit = async (values: PermissionFormValues) => {
    try {
      const selectedScreens = Object.entries(values.telas)
        .filter(([_, isSelected]) => isSelected)
        .map(([screen]) => screen);

      if (selectedScreens.length === 0) {
        toast({
          title: "Erro",
          description: "Selecione pelo menos uma tela",
          variant: "destructive",
        });
        return;
      }

      // Create a permission entry for each selected screen
      for (const screen of selectedScreens) {
        await createPermission.mutateAsync({
          usuario_id: values.usuario_id,
          tela: screen,
          acesso: values.acesso,
          permissao_usuario: values.permissao_usuario,
        });
      }
    } catch (error) {
      console.error('Error creating permissions:', error);
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
              {createPermission.isPending ? "Criando..." : "Criar Permissão"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}