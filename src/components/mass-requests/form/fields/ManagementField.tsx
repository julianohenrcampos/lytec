import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useFormContext } from "react-hook-form";
import { FormValues } from "../../types";

export function ManagementField() {
  const { control } = useFormContext<FormValues>();

  return (
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
  );
}