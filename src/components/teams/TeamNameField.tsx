import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { TeamFormValues } from "./types";

interface TeamNameFieldProps {
  form: UseFormReturn<TeamFormValues>;
}

export const TeamNameField = ({ form }: TeamNameFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="nome"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Nome da Equipe</FormLabel>
          <FormControl>
            <Input {...field} disabled placeholder="Nome será gerado automaticamente" />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};