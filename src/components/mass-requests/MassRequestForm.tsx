import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
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
import { StreetList } from "./StreetList";

interface Street {
  logradouro: string;
  bairro?: string;
  largura: number;
  comprimento: number;
  espessura: number;
  area?: number;
  peso?: number;
}

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
  streets?: Street[];
}

interface FormValues {
  centro_custo: string;
  diretoria?: string;
  gerencia?: string;
  engenheiro: string;
  data: Date;
  ligante?: string;
  streets: Street[];
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

  const methods = useForm<FormValues>({
    defaultValues: initialData
      ? {
          ...initialData,
          data: new Date(initialData.data),
          streets: initialData.streets || [{
            logradouro: initialData.logradouro,
            bairro: initialData.bairro,
            largura: initialData.largura,
            comprimento: initialData.comprimento,
            espessura: initialData.espessura,
          }],
        }
      : {
          centro_custo: "",
          diretoria: "",
          gerencia: "",
          engenheiro: userProfile ? `${userProfile.first_name} ${userProfile.last_name}` : user?.email || "",
          data: new Date(),
          ligante: "",
          streets: [{
            logradouro: "",
            bairro: "",
            largura: 0,
            comprimento: 0,
            espessura: 0,
          }],
        },
  });

  const createMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      // First create the main request
      const { data: requestData, error: requestError } = await supabase
        .from("bd_requisicao")
        .insert([
          {
            centro_custo: values.centro_custo,
            diretoria: values.diretoria,
            gerencia: values.gerencia,
            engenheiro: values.engenheiro,
            data: format(values.data, "yyyy-MM-dd"),
            ligante: values.ligante,
            // Use the first street as the main request data
            logradouro: values.streets[0].logradouro,
            bairro: values.streets[0].bairro,
            largura: values.streets[0].largura,
            comprimento: values.streets[0].comprimento,
            espessura: values.streets[0].espessura,
            area: values.streets[0].largura * values.streets[0].comprimento,
            peso: values.streets[0].largura * values.streets[0].comprimento * values.streets[0].espessura * 2.4,
          },
        ])
        .select()
        .single();

      if (requestError) throw requestError;

      // Then create all the streets
      if (values.streets.length > 1) {
        const streetsToInsert = values.streets.slice(1).map(street => ({
          requisicao_id: requestData.id,
          logradouro: street.logradouro,
          bairro: street.bairro,
          largura: street.largura,
          comprimento: street.comprimento,
          espessura: street.espessura,
        }));

        const { error: streetsError } = await supabase
          .from("bd_ruas_requisicao")
          .insert(streetsToInsert);

        if (streetsError) throw streetsError;
      }

      return requestData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mass-requests"] });
      methods.reset();
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

      // Update main request
      const { data: requestData, error: requestError } = await supabase
        .from("bd_requisicao")
        .update({
          centro_custo: values.centro_custo,
          diretoria: values.diretoria,
          gerencia: values.gerencia,
          engenheiro: values.engenheiro,
          data: format(values.data, "yyyy-MM-dd"),
          ligante: values.ligante,
          logradouro: values.streets[0].logradouro,
          bairro: values.streets[0].bairro,
          largura: values.streets[0].largura,
          comprimento: values.streets[0].comprimento,
          espessura: values.streets[0].espessura,
          area: values.streets[0].largura * values.streets[0].comprimento,
          peso: values.streets[0].largura * values.streets[0].comprimento * values.streets[0].espessura * 2.4,
        })
        .eq("id", initialData.id)
        .select()
        .single();

      if (requestError) throw requestError;

      // Delete existing streets
      const { error: deleteError } = await supabase
        .from("bd_ruas_requisicao")
        .delete()
        .eq("requisicao_id", initialData.id);

      if (deleteError) throw deleteError;

      // Insert new streets
      if (values.streets.length > 1) {
        const streetsToInsert = values.streets.slice(1).map(street => ({
          requisicao_id: initialData.id,
          logradouro: street.logradouro,
          bairro: street.bairro,
          largura: street.largura,
          comprimento: street.comprimento,
          espessura: street.espessura,
        }));

        const { error: streetsError } = await supabase
          .from("bd_ruas_requisicao")
          .insert(streetsToInsert);

        if (streetsError) throw streetsError;
      }

      return requestData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mass-requests"] });
      methods.reset();
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
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={methods.control}
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
            control={methods.control}
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
            control={methods.control}
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
            control={methods.control}
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
            control={methods.control}
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
            control={methods.control}
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
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Ruas</h3>
          <StreetList />
        </div>

        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              methods.reset();
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
    </FormProvider>
  );
}