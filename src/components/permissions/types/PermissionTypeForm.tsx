import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { permissionTypeSchema, type PermissionTypeFormValues } from "./schema";

interface PermissionTypeFormProps {
  permissionType?: {
    id: string;
    name: string;
    label: string;
    description: string | null;
  } | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function PermissionTypeForm({
  permissionType,
  onSuccess,
  onCancel,
}: PermissionTypeFormProps) {
  const form = useForm<PermissionTypeFormValues>({
    resolver: zodResolver(permissionTypeSchema),
    defaultValues: {
      name: permissionType?.name || "",
      label: permissionType?.label || "",
      description: permissionType?.description || "",
    },
  });

  const { mutate: savePermissionType, isPending } = useMutation({
    mutationFn: async (values: PermissionTypeFormValues) => {
      if (permissionType) {
        const { error } = await supabase
          .from("permission_types")
          .update({
            name: values.name,
            label: values.label,
            description: values.description
          })
          .eq("id", permissionType.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("permission_types")
          .insert({
            name: values.name,
            label: values.label,
            description: values.description
          });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(
        permissionType
          ? "Tipo de permissão atualizado com sucesso"
          : "Tipo de permissão criado com sucesso"
      );
      onSuccess();
    },
    onError: (error) => {
      console.error("Error saving permission type:", error);
      toast.error("Erro ao salvar tipo de permissão");
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => savePermissionType(values))}
        className="space-y-4 bg-gray-50 p-4 rounded-lg"
      >
        <h3 className="text-lg font-semibold">
          {permissionType ? "Editar" : "Novo"} Tipo de Permissão
        </h3>

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Identificador</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Ex: gerente_vendas"
                  disabled={!!permissionType}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="label"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Ex: Gerente de Vendas" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Descreva as responsabilidades deste tipo de permissão"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </form>
    </Form>
  );
}