import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface MassProgrammingFormProps {
  initialData?: any;
  onSuccess: () => void;
}

interface FormValues {
  data_entrega: Date;
  tipo_lancamento: string;
  usina: string;
  centro_custo_id: string;
  logradouro: string;
  encarregado: string;
  apontador: string;
  caminhao?: string;
  volume?: number;
}

export function MassProgrammingForm({ initialData, onSuccess }: MassProgrammingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    defaultValues: initialData || {
      data_entrega: new Date(),
      tipo_lancamento: "",
      usina: "",
      centro_custo_id: "",
      logradouro: "",
      encarregado: "",
      apontador: "",
      caminhao: "",
      volume: 0,
    },
  });

  const { data: plants } = useQuery({
    queryKey: ["plants"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bd_usinas")
        .select("id, usina")
        .order("usina");
      if (error) throw error;
      return data;
    },
  });

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

  const { data: managers } = useQuery({
    queryKey: ["managers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bd_rhasfalto")
        .select("id, nome")
        .eq("funcao_id", "encarregado")
        .order("nome");
      if (error) throw error;
      return data;
    },
  });

  const { data: pointers } = useQuery({
    queryKey: ["pointers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bd_rhasfalto")
        .select("id, nome")
        .eq("funcao_id", "apontador")
        .order("nome");
      if (error) throw error;
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const { data, error } = await supabase
        .from("bd_programacaomassa")
        .insert([values])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["massProgramming"] });
      form.reset();
      onSuccess();
      toast({
        title: "Programação criada com sucesso",
        variant: "default",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao criar programação",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      if (!initialData) throw new Error("No program selected for editing");

      const { data, error } = await supabase
        .from("bd_programacaomassa")
        .update(values)
        .eq("id", initialData.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["massProgramming"] });
      form.reset();
      onSuccess();
      toast({
        title: "Programação atualizada com sucesso",
        variant: "default",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao atualizar programação",
        description: error.message,
        variant: "destructive",
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

  const handleDuplicate = () => {
    const currentValues = form.getValues();
    form.reset({
      ...currentValues,
      caminhao: "",
      volume: 0,
    });
  };

  const handleNewLine = () => {
    form.reset({
      data_entrega: new Date(),
      tipo_lancamento: "",
      usina: "",
      centro_custo_id: "",
      logradouro: "",
      encarregado: "",
      apontador: "",
      caminhao: "",
      volume: 0,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="data_entrega"
            rules={{ required: "Data de entrega é obrigatória" }}
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data de Entrega</FormLabel>
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
                        date < new Date()
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
            name="tipo_lancamento"
            rules={{ required: "Tipo de lançamento é obrigatório" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Lançamento</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Acabadora">Acabadora</SelectItem>
                    <SelectItem value="Manual">Manual</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="usina"
            rules={{ required: "Usina é obrigatória" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Usina</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a usina" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {plants?.map((plant) => (
                      <SelectItem key={plant.id} value={plant.usina}>
                        {plant.usina}
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
            name="centro_custo_id"
            rules={{ required: "Centro de custo é obrigatório" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Centro de Custo</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o centro de custo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {costCenters?.map((cc) => (
                      <SelectItem key={cc.id} value={cc.id}>
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
            name="encarregado"
            rules={{ required: "Encarregado é obrigatório" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Encarregado</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o encarregado" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {managers?.map((manager) => (
                      <SelectItem key={manager.id} value={manager.id}>
                        {manager.nome}
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
            name="apontador"
            rules={{ required: "Apontador é obrigatório" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Apontador</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o apontador" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {pointers?.map((pointer) => (
                      <SelectItem key={pointer.id} value={pointer.id}>
                        {pointer.nome}
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
            name="caminhao"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Caminhão</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Digite o caminhão" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="volume"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Volume (t)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    step="0.01"
                    placeholder="Digite o volume"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-between">
          <div className="space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleDuplicate}
            >
              Duplicar Linha
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleNewLine}
            >
              Nova Linha
            </Button>
          </div>
          <div className="space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {initialData ? "Atualizar" : "Salvar"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}