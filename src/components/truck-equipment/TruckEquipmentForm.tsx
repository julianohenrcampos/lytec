import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import type { TruckEquipment } from "./types";

const formSchema = z.object({
  frota_id: z.string().min(1, "Frota é obrigatória"),
  tipo: z.enum(["Caminhão", "Equipamento"], {
    required_error: "Tipo é obrigatório",
  }),
  modelo: z.string().min(1, "Modelo é obrigatório"),
  ano: z.string().optional().transform(val => val ? parseInt(val) : undefined),
  capacidade: z.string().optional().transform(val => val ? parseFloat(val) : undefined),
  proprietario: z.string().optional(),
  descricao: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface TruckEquipmentFormProps {
  initialData?: TruckEquipment | null;
  onSuccess?: () => void;
}

export function TruckEquipmentForm({ initialData, onSuccess }: TruckEquipmentFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: fleets } = useQuery({
    queryKey: ["fleets"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bd_frota")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      frota_id: initialData?.frota_id || "",
      tipo: initialData?.tipo || "Caminhão",
      modelo: initialData?.modelo || "",
      ano: initialData?.ano?.toString() || "",
      capacidade: initialData?.capacidade?.toString() || "",
      proprietario: initialData?.proprietario || "",
      descricao: initialData?.descricao || "",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const { error } = await supabase
        .from("bd_caminhaoequipamento")
        .insert([{
          frota_id: values.frota_id,
          tipo: values.tipo,
          modelo: values.modelo,
          ano: values.ano,
          capacidade: values.capacidade,
          proprietario: values.proprietario,
          descricao: values.descricao,
        }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trucks-equipment"] });
      toast({ title: "Item cadastrado com sucesso!" });
      form.reset();
      onSuccess?.();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erro ao cadastrar item",
        description: error.message,
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const { error } = await supabase
        .from("bd_caminhaoequipamento")
        .update({
          frota_id: values.frota_id,
          tipo: values.tipo,
          modelo: values.modelo,
          ano: values.ano,
          capacidade: values.capacidade,
          proprietario: values.proprietario,
          descricao: values.descricao,
        })
        .eq("id", initialData?.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trucks-equipment"] });
      toast({ title: "Item atualizado com sucesso!" });
      onSuccess?.();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar item",
        description: error.message,
      });
    },
  });

  const onSubmit = (values: FormValues) => {
    if (initialData) {
      updateMutation.mutate(values);
    } else {
      createMutation.mutate(values);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="frota_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Frota</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma frota" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {fleets?.map((fleet) => (
                      <SelectItem key={fleet.id} value={fleet.id}>
                        {`${fleet.frota} ${fleet.numero}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tipo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Caminhão">Caminhão</SelectItem>
                    <SelectItem value="Equipamento">Equipamento</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="modelo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Modelo</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="ano"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ano</FormLabel>
                <FormControl>
                  <Input {...field} type="number" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="capacidade"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Capacidade</FormLabel>
                <FormControl>
                  <Input {...field} type="number" step="0.01" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="proprietario"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Proprietário</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="descricao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              form.reset();
              onSuccess?.();
            }}
          >
            Cancelar
          </Button>
          <Button type="submit">
            {initialData ? "Atualizar" : "Salvar"}
          </Button>
        </div>
      </form>
    </Form>
  );
}