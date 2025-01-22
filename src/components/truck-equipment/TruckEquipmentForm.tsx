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

const currentYear = new Date().getFullYear();
const yearOptions = Array.from({ length: 51 }, (_, i) => currentYear - i);

const formSchema = z.object({
  frota_id: z.string().min(1, "Frota é obrigatória"),
  tipo: z.enum(["Caminhão", "Equipamento"], {
    required_error: "Tipo é obrigatório",
  }),
  modelo: z.string().min(1, "Modelo é obrigatório"),
  ano: z.number().min(currentYear - 50).max(currentYear).optional(),
  capacidade: z.number().min(0).optional(),
  proprietario: z.string().optional(),
  descricao: z.string().optional(),
  placa: z.string().optional(),
  aluguel: z.number().min(0).optional(),
  imagem: z.any().optional(),
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
      ano: initialData?.ano || undefined,
      capacidade: initialData?.capacidade || undefined,
      proprietario: initialData?.proprietario || "",
      descricao: initialData?.descricao || "",
      placa: initialData?.placa || "",
      aluguel: initialData?.aluguel || undefined,
      imagem: undefined,
    },
  });

  const handleImageUpload = async (file: File) => {
    if (!file) return null;
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    
    const { error: uploadError, data } = await supabase.storage
      .from('truck-equipment-images')
      .upload(fileName, file);

    if (uploadError) {
      console.error('Error uploading image:', uploadError);
      throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('truck-equipment-images')
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const createMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      console.log("Creating new truck/equipment:", values);
      let imageUrl = null;
      
      if (values.imagem instanceof FileList && values.imagem.length > 0) {
        imageUrl = await handleImageUpload(values.imagem[0]);
      }

      const { data, error } = await supabase
        .from("bd_caminhaoequipamento")
        .insert([{
          frota_id: values.frota_id,
          tipo: values.tipo,
          modelo: values.modelo,
          ano: values.ano,
          capacidade: values.capacidade,
          proprietario: values.proprietario,
          descricao: values.descricao,
          placa: values.placa,
          aluguel: values.aluguel,
          imagem: imageUrl,
        }])
        .select()
        .single();

      if (error) {
        console.error("Error creating truck/equipment:", error);
        // Check for unique constraint violation
        if (error.code === '23505' && error.message.includes('unique_placa_idx')) {
          throw new Error('Esta placa já está cadastrada no sistema.');
        }
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trucks-equipment"] });
      toast({ title: "Item cadastrado com sucesso!" });
      form.reset();
      onSuccess?.();
    },
    onError: (error) => {
      console.error("Mutation error:", error);
      toast({
        variant: "destructive",
        title: "Erro ao cadastrar item",
        description: error instanceof Error ? error.message : "Erro desconhecido",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      console.log("Updating truck/equipment:", values);
      let imageUrl = initialData?.imagem;
      
      if (values.imagem instanceof FileList && values.imagem.length > 0) {
        imageUrl = await handleImageUpload(values.imagem[0]);
      }

      const { data, error } = await supabase
        .from("bd_caminhaoequipamento")
        .update({
          frota_id: values.frota_id,
          tipo: values.tipo,
          modelo: values.modelo,
          ano: values.ano,
          capacidade: values.capacidade,
          proprietario: values.proprietario,
          descricao: values.descricao,
          placa: values.placa,
          aluguel: values.aluguel,
          imagem: imageUrl,
        })
        .eq("id", initialData?.id)
        .select()
        .single();

      if (error) {
        console.error("Error updating truck/equipment:", error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trucks-equipment"] });
      toast({ title: "Item atualizado com sucesso!" });
      onSuccess?.();
    },
    onError: (error) => {
      console.error("Mutation error:", error);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar item",
        description: error.message,
      });
    },
  });

  const onSubmit = (values: FormValues) => {
    console.log("Form submitted with values:", values);
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
            name="placa"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Placa</FormLabel>
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
                <Select
                  onValueChange={(value) => field.onChange(Number(value))}
                  value={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o ano" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {yearOptions.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
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
            name="capacidade"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Capacidade</FormLabel>
                <FormControl>
                  <Input 
                    type="number"
                    min="0"
                    step="1"
                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                    value={field.value || ""}
                  />
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

          <FormField
            control={form.control}
            name="aluguel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Aluguel (R$)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="imagem"
            render={({ field: { value, onChange, ...field } }) => (
              <FormItem>
                <FormLabel>Imagem</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => onChange(e.target.files)}
                    {...field}
                  />
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
