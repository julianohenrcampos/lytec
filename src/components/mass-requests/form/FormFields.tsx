import { useFormContext } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import {
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export function FormFields() {
  const { control } = useFormContext();
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={control}
        name="centro_custo"
        rules={{ required: "Centro de custo é obrigatório" }}
        render={({ field }) => (
          <FormItem className="w-full">
            <FormLabel>Centro de Custo</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="w-full">
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
        control={control}
        name="diretoria"
        render={({ field }) => (
          <FormItem className="w-full">
            <FormLabel>Diretoria</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Digite a diretoria" className="w-full" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="gerencia"
        render={({ field }) => (
          <FormItem className="w-full">
            <FormLabel>Gerência</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Digite a gerência" className="w-full" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="engenheiro"
        rules={{ required: "Engenheiro é obrigatório" }}
        render={({ field }) => (
          <FormItem className="w-full">
            <FormLabel>Engenheiro</FormLabel>
            <FormControl>
              <Input {...field} disabled placeholder="Engenheiro responsável" className="w-full" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="data"
        rules={{ required: "Data é obrigatória" }}
        render={({ field }) => (
          <FormItem className="flex flex-col w-full">
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
        control={control}
        name="ligante"
        render={({ field }) => (
          <FormItem className="w-full">
            <FormLabel>Ligante</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione o tipo de ligante" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="IMPRIMA">IMPRIMA</SelectItem>
                <SelectItem value="RR">RR</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}