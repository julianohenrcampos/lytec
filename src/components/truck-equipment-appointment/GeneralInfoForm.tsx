import { UseFormReturn } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface GeneralInfoFormProps {
  form: UseFormReturn<any>;
  onNext: () => void;
}

export function GeneralInfoForm({ form, onNext }: GeneralInfoFormProps) {
  const { data: costCenters } = useQuery({
    queryKey: ["costCenters"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bd_centrocusto")
        .select("*")
        .order("nome");
      if (error) throw error;
      return data;
    },
  });

  const { data: trucks } = useQuery({
    queryKey: ["trucks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bd_caminhaoequipamento")
        .select("*, frota:frota_id(frota, numero)")
        .order("created_at");
      if (error) throw error;
      return data;
    },
  });

  return (
    <Form {...form}>
      <form className="space-y-4">
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
          name="status"
          rules={{ required: "Status é obrigatório" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Operando">Operando</SelectItem>
                  <SelectItem value="Em Manutenção">Em Manutenção</SelectItem>
                  <SelectItem value="Parado">Parado</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="caminhao_equipamento_id"
          rules={{ required: "Caminhão/Equipamento é obrigatório" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Caminhão/Equipamento</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o caminhão/equipamento" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {trucks?.map((truck) => (
                    <SelectItem key={truck.id} value={truck.id}>
                      {`${truck.frota?.frota} ${truck.frota?.numero} - ${truck.modelo}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="hora_inicial"
            rules={{ required: "Hora inicial é obrigatória" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hora Inicial</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="hora_final"
            rules={{ required: "Hora final é obrigatória" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hora Final</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="horimetro_inicial"
            rules={{ required: "Horímetro inicial é obrigatório" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Horímetro Inicial</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="horimetro_final"
            rules={{ required: "Horímetro final é obrigatório" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Horímetro Final</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="abastecimento"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Abastecimento</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="anotacoes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Anotações</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="button" className="w-full" onClick={onNext}>
          Avançar
        </Button>
      </form>
    </Form>
  );
}