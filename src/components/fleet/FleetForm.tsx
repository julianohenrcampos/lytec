import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Database } from "@/integrations/supabase/types";

type Fleet = Database["public"]["Tables"]["bd_frota"]["Row"];

const formSchema = z.object({
  frota: z.string().min(1, "O nome da frota é obrigatório"),
  numero: z.string().min(1, "O número da frota é obrigatório"),
});

export type FormValues = z.infer<typeof formSchema>;

interface FleetFormProps {
  onSubmit: (values: FormValues) => void;
  initialData?: Fleet;
  isSubmitting?: boolean;
}

export function FleetForm({ onSubmit, initialData, isSubmitting }: FleetFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      frota: initialData?.frota || "",
      numero: initialData?.numero || "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="frota"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome da Frota</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="numero"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número da Frota</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {initialData ? "Atualizar" : "Criar"}
        </Button>
      </form>
    </Form>
  );
}