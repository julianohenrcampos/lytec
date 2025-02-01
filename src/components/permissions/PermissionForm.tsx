import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { usePermissionForm } from "./usePermissionForm";
import { PermissionFormFields } from "./PermissionFormFields";
import { permissionFormSchema, type PermissionFormValues } from "./schema";
import type { UserPermissionLevel } from "@/types/permissions";

interface PermissionFormProps {
  selectedUser: {
    id: string;
    nome: string;
    permissao_usuario: UserPermissionLevel | null;
  } | null;
  onSuccess: () => void;
}

export function PermissionForm({ selectedUser, onSuccess }: PermissionFormProps) {
  const { users, isLoadingUsers, createPermission } = usePermissionForm({ onSuccess });

  const form = useForm<PermissionFormValues>({
    resolver: zodResolver(permissionFormSchema),
    defaultValues: {
      usuario_id: selectedUser?.id || "",
      permissao_usuario: selectedUser?.permissao_usuario || undefined,
      telas: [],
      acesso: true,
    },
  });

  const onSubmit = async (data: PermissionFormValues) => {
    try {
      console.log("Form submission data:", data);
      await createPermission.mutateAsync({
        usuario_id: data.usuario_id,
        permissao_usuario: data.permissao_usuario,
        screens: data.telas || [],
      });
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <PermissionFormFields
          form={form}
          users={users}
          isLoadingUsers={isLoadingUsers}
        />
        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={onSuccess}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={createPermission.isPending}
          >
            {createPermission.isPending ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </form>
    </Form>
  );
}