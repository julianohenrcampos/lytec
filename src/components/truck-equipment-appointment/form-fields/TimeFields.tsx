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
  return (
    <div className="space-y-4">
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