import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, Pencil } from "lucide-react";
import { FleetForm } from "./FleetForm";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import type { Database } from "@/integrations/supabase/types";

type Fleet = Database["public"]["Tables"]["bd_frota"]["Row"];

interface FleetFormDialogProps {
  initialData?: Fleet;
  onOpenChange?: (open: boolean) => void;
}

export function FleetFormDialog({ initialData, onOpenChange }: FleetFormDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    onOpenChange?.(newOpen);
  };

  const handleSubmit = async (values: { frota: string; numero: string }) => {
    try {
      if (initialData) {
        const { error } = await supabase
          .from("bd_frota")
          .update(values)
          .eq("id", initialData.id);

        if (error) throw error;

        toast({
          title: "Frota atualizada com sucesso",
        });
      } else {
        const { error } = await supabase
          .from("bd_frota")
          .insert(values);

        if (error) throw error;

        toast({
          title: "Frota cadastrada com sucesso",
        });
      }

      queryClient.invalidateQueries({ queryKey: ["fleets"] });
      handleOpenChange(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao salvar frota",
        description: error instanceof Error ? error.message : "Erro desconhecido",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild data-fleet-id={initialData?.id}>
        {initialData ? (
          <span className="sr-only">Editar Frota</span>
        ) : (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Frota
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Editar Frota" : "Nova Frota"}
          </DialogTitle>
        </DialogHeader>
        <FleetForm
          onSubmit={handleSubmit}
          initialData={initialData}
        />
      </DialogContent>
    </Dialog>
  );
}