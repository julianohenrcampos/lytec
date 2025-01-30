import { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface TimeFieldsProps {
  form: UseFormReturn<any>;
}

export function TimeFields({ form }: TimeFieldsProps) {
  useEffect(() => {
    // Set current time on mount
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    form.setValue('hora_inicial', currentTime);
  }, [form]);

  return (
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
  );
}