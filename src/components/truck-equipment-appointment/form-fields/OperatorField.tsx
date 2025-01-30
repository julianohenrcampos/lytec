import { UseFormReturn } from "react-hook-form";
import { useAuth } from "@/hooks/useAuth";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface OperatorFieldProps {
  form: UseFormReturn<any>;
}

export function OperatorField({ form }: OperatorFieldProps) {
  const { user } = useAuth();

  return (
    <FormField
      control={form.control}
      name="operador"
      defaultValue={user?.email}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Operador</FormLabel>
          <FormControl>
            <Input {...field} readOnly />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}