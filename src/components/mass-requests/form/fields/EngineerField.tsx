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

export function EngineerField() {
  const { control } = useFormContext<FormValues>();

  return (
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
  );
}