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

export function DirectoryField() {
  const { control } = useFormContext<FormValues>();

  return (
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
  );
}