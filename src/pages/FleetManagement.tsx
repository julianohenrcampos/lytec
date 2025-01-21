import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FleetForm, FormValues } from "@/components/fleet/FleetForm";
import { FleetTable } from "@/components/fleet/FleetTable";
import type { Database } from "@/integrations/supabase/types";

type Fleet = Database["public"]["Tables"]["bd_frota"]["Row"];

export default function FleetManagement() {
  const [editingFleet, setEditingFleet] = useState<Fleet | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const { error } = await supabase.from("bd_frota").insert([{
        frota: values.frota,
        numero: values.numero,
      }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fleets"] });
      toast({
        title: "Frota criada com sucesso",
        variant: "default",
      });
      setEditingFleet(null);
    },
    onError: (error) => {
      toast({
        title: "Erro ao criar frota",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...values }: FormValues & { id: string }) => {
      const { error } = await supabase
        .from("bd_frota")
        .update({
          frota: values.frota,
          numero: values.numero,
        })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fleets"] });
      toast({
        title: "Frota atualizada com sucesso",
        variant: "default",
      });
      setEditingFleet(null);
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar frota",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (values: FormValues) => {
    if (editingFleet) {
      updateMutation.mutate({ ...values, id: editingFleet.id });
    } else {
      createMutation.mutate(values);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {editingFleet ? "Editar Frota" : "Cadastrar Nova Frota"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FleetForm
            onSubmit={handleSubmit}
            initialData={editingFleet}
            isSubmitting={createMutation.isPending || updateMutation.isPending}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Frotas Cadastradas</CardTitle>
        </CardHeader>
        <CardContent>
          <FleetTable onEdit={setEditingFleet} />
        </CardContent>
      </Card>
    </div>
  );
}