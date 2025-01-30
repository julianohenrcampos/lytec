import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface HourmeterFieldsProps {
  form: UseFormReturn<any>;
}

export function HourmeterFields({ form }: HourmeterFieldsProps) {
  return (
    <div className="space-y-4">
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
  );
}