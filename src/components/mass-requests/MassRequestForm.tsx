import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MassRequest {
  id: string;
  centro_custo: string;
  diretoria?: string;
  gerencia?: string;
  engenheiro: string;
  data: string;
  logradouro: string;
  bairro?: string;
  largura: number;
  comprimento: number;
  ligante?: string;
  area: number;
  espessura: number;
  peso: number;
}

interface FormValues {
  centro_custo: string;
  diretoria?: string;
  gerencia?: string;
  engenheiro: string;
  data: Date;
  logradouro: string;
  bairro?: string;
  largura: number;
  comprimento: number;
  ligante?: string;
  espessura: number;
}

interface MassRequestFormProps {
  initialData?: MassRequest | null;
  onSuccess: () => void;
}

export function MassRequestForm({ initialData, onSuccess }: MassRequestFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Fetch cost centers
  const { data: costCenters } = useQuery({
    queryKey: ["costCenters"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bd_centrocusto")
        .select("id, nome")
        .order("nome");

      if (error) throw error;
      return data;
    },
  });

  // Fetch logged in user's profile
  const { data: userProfile } = useQuery({
    queryKey: ["userProfile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from("profiles")
        .select("first_name, last_name")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const form = useForm<FormValues>({
    defaultValues: initialData
      ? {
          ...initialData,
          data: new Date(initialData.data),
          largura: Number(initialData.largura),
          comprimento: Number(initialData.comprimento),
          espessura: Number(initialData.espessura),
        }
      : {
          centro_custo: "",
          diretoria: "",
          gerencia: "",
          engenheiro: userProfile ? `${userProfile.first_name} ${userProfile.last_name}` : user?.email || "",
          data: new Date(),
          logradouro: "",
          bairro: "",
          largura: 0,
          comprimento: 0,
          ligante: "",
          espessura: 0,
        },
  });

  const createMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const { data, error } = await supabase
        .from("bd_requisicao")
        .insert([
          {
            ...values,
            data: format(values.data, "yyyy-MM-dd"),
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mass-requests"] });
      form.reset();
      onSuccess();
      toast({
        title: "Requisição criada com sucesso",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Erro ao criar requisição",
        description: error.message,
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      if (!initialData) throw new Error("No request selected for editing");

      const { data, error } = await supabase
        .from("bd_requisicao")
        .update({
          ...values,
          data: format(values.data, "yyyy-MM-dd"),
        })
        .eq("id", initialData.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mass-requests"] });
      form.reset();
      onSuccess();
      toast({
        title: "Requisição atualizada com sucesso",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar requisição",
        description: error.message,
      });
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      if (initialData) {
        await updateMutation.mutateAsync(values);
      } else {
        await createMutation.mutateAsync(values);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="centro_custo"
            rules={{ required: "Centro de custo é obrigatório" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Centro de Custo</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um centro de custo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {costCenters?.map((cc) => (
                      <SelectItem key={cc.id} value={cc.nome}>
                        {cc.nome}
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
            name="diretoria"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Diretoria</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Digite a diretoria" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="gerencia"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gerência</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Digite a gerência" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="engenheiro"
            rules={{ required: "Engenheiro é obrigatório" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Engenheiro</FormLabel>
                <FormControl>
                  <Input {...field} disabled placeholder="Engenheiro responsável" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="data"
            rules={{ required: "Data é obrigatória" }}
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "dd/MM/yyyy")
                        ) : (
                          <span>Selecione uma data</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="logradouro"
            rules={{ required: "Logradouro é obrigatório" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Logradouro</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Digite o logradouro" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bairro"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bairro</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Digite o bairro" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="largura"
            rules={{ required: "Largura é obrigatória" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Largura (m)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    step="0.01"
                    placeholder="Digite a largura"
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="comprimento"
            rules={{ required: "Comprimento é obrigatório" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Comprimento (m)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    step="0.01"
                    placeholder="Digite o comprimento"
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="ligante"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ligante</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Digite o tipo de ligante" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="espessura"
            rules={{ required: "Espessura é obrigatória" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Espessura (m)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    step="0.01"
                    placeholder="Digite a espessura"
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              form.reset();
              onSuccess();
            }}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {initialData ? "Atualizar" : "Criar"} Requisição
          </Button>
        </div>
      </form>
    </Form>
  );
}
