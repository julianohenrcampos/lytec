import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const plantSchema = z.object({
  usina: z.string().min(1, "Nome da usina é obrigatório"),
  endereco: z.string().optional(),
  producao_total: z.string()
    .optional()
    .transform((val) => {
      if (!val) return null;
      const num = Number(val);
      return isNaN(num) ? null : num;
    }),
});

type PlantFormValues = z.infer<typeof plantSchema>;

interface PlantFormProps {
  onSuccess: () => void;
  initialData?: {
    id: string;
    usina: string;
    endereco: string | null;
    producao_total: number | null;
  };
}

export function PlantForm({ onSuccess, initialData }: PlantFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<PlantFormValues>({
    resolver: zodResolver(plantSchema),
    defaultValues: {
      usina: initialData?.usina || "",
      endereco: initialData?.endereco || "",
      producao_total: initialData?.producao_total?.toString() || "",
    },
  });

  const onSubmit = async (data: PlantFormValues) => {
    try {
      setIsSubmitting(true);
      
      if (initialData?.id) {
        const { error } = await supabase
          .from("bd_usinas")
          .update({
            usina: data.usina,
            endereco: data.endereco || null,
            producao_total: data.producao_total,
          })
          .eq("id", initialData.id);

        if (error) throw error;
        toast({ title: "Usina atualizada com sucesso!" });
      } else {
        const { error } = await supabase
          .from("bd_usinas")
          .insert({
            usina: data.usina,
            endereco: data.endereco || null,
            producao_total: data.producao_total,
          });

        if (error) throw error;
        toast({ title: "Usina cadastrada com sucesso!" });
      }
      
      form.reset();
      onSuccess();
    } catch (error: any) {
      if (error?.code === "23505") {
        toast({
          variant: "destructive",
          title: "Erro ao salvar",
          description: "Uma usina com este nome já existe.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Erro ao salvar",
          description: "Ocorreu um erro ao salvar a usina.",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="usina"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome da Usina*</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="endereco"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Endereço</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="producao_total"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Produção Total (T)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              form.reset();
              onSuccess();
            }}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {initialData ? "Atualizar" : "Salvar"}
          </Button>
        </div>
      </form>
    </Form>
  );
}