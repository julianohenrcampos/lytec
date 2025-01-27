import {
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
import { useFormContext } from "react-hook-form";
import { FormValues } from "../../types";

export function BinderField() {
  const { control } = useFormContext<FormValues>();

  return (
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
  );
}