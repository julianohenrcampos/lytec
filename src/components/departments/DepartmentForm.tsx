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

type Department = Database["public"]["Tables"]["bd_departamento"]["Row"];

const formSchema = z.object({
  nome: z.string().min(1, "O nome do departamento é obrigatório"),
});

export type FormValues = z.infer<typeof formSchema>;

interface DepartmentFormProps {
  onSubmit: (values: FormValues) => void;
  initialData?: Department;
  isSubmitting?: boolean;
}

export function DepartmentForm({ onSubmit, initialData, isSubmitting }: DepartmentFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: initialData?.nome || "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="nome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Departamento</FormLabel>
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