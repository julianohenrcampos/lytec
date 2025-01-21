import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { FleetFormDialog } from "./FleetFormDialog";
import type { Database } from "@/integrations/supabase/types";

type Fleet = Database["public"]["Tables"]["bd_frota"]["Row"];

export function FleetTable() {
  const [fleetToDelete, setFleetToDelete] = useState<Fleet | null>(null);
  const { toast } = useToast();

  const { data: fleets, isLoading } = useQuery({
    queryKey: ["fleets"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bd_frota")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleDelete = async () => {
    if (!fleetToDelete) return;

    try {
      const { error } = await supabase
        .from("bd_frota")
        .delete()
        .eq("id", fleetToDelete.id);

      if (error) throw error;

      toast({
        title: "Frota excluída com sucesso",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao excluir frota",
        description: error instanceof Error ? error.message : "Erro desconhecido",
      });
    } finally {
      setFleetToDelete(null);
    }
  };

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Frota</TableHead>
            <TableHead>Número</TableHead>
            <TableHead className="w-[100px]">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {fleets?.map((fleet) => (
            <TableRow key={fleet.id}>
              <TableCell>{fleet.frota}</TableCell>
              <TableCell>{fleet.numero}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <FleetFormDialog initialData={fleet} />
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => setFleetToDelete(fleet)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AlertDialog
        open={!!fleetToDelete}
        onOpenChange={(open) => !open && setFleetToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta frota? Esta ação não pode ser
              desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}