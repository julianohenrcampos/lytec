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
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { permissionTypeSchema, type PermissionTypeFormValues } from "./schema";

const AVAILABLE_SCREENS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'employees', label: 'Funcionários' },
  { id: 'teams', label: 'Equipes' },
  { id: 'companies', label: 'Empresas' },
  { id: 'functions', label: 'Funções' },
  { id: 'cost-centers', label: 'Centros de Custo' },
  { id: 'fleets', label: 'Frotas' },
  { id: 'trucks-equipment', label: 'Caminhões e Equipamentos' },
  { id: 'plants', label: 'Usinas' },
  { id: 'mass-requests', label: 'Requisições de Massa' },
  { id: 'mass-programming', label: 'Programação de Massa' },
  { id: 'permissions', label: 'Permissões' },
  { id: 'profile', label: 'Perfil' },
  { id: 'settings', label: 'Configurações' },
  { id: 'inspection-checklist', label: 'Checklist de Inspeção' },
  { id: 'checklist-list', label: 'Lista de Checklists' }
];

interface PermissionTypeFormProps {
  permissionType?: {
    id: string;
    name: string;
    label: string;
    description: string | null;
    active: boolean;
    screens: string[];
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
      active: permissionType?.active ?? true,
      screens: permissionType?.screens || [],
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
            description: values.description,
            active: values.active,
            screens: values.screens,
          })
          .eq("id", permissionType.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("permission_types")
          .insert({
            name: values.name,
            label: values.label,
            description: values.description,
            active: values.active,
            screens: values.screens,
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
        className="space-y-4"
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

        <FormField
          control={form.control}
          name="active"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel>Ativo</FormLabel>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="screens"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telas com Acesso</FormLabel>
              <div className="grid grid-cols-2 gap-4 mt-2">
                {AVAILABLE_SCREENS.map((screen) => (
                  <div key={screen.id} className="flex items-center space-x-2">
                    <Switch
                      checked={field.value.includes(screen.id)}
                      onCheckedChange={(checked) => {
                        const newScreens = checked
                          ? [...field.value, screen.id]
                          : field.value.filter((s) => s !== screen.id);
                        field.onChange(newScreens);
                      }}
                    />
                    <span>{screen.label}</span>
                  </div>
                ))}
              </div>
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