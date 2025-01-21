import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { TruckEquipment } from "./types";

interface TruckEquipmentTableProps {
  onEdit: (item: TruckEquipment) => void;
  fleetFilter?: string;
  licensePlateFilter?: string;
}

export function TruckEquipmentTable({
  onEdit,
  fleetFilter,
  licensePlateFilter,
}: TruckEquipmentTableProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: items, isLoading } = useQuery({
    queryKey: ["trucks-equipment", fleetFilter, licensePlateFilter],
    queryFn: async () => {
      let query = supabase
        .from("bd_caminhaoequipamento")
        .select(`
          *,
          frota:bd_frota(frota, numero)
        `)
        .order("created_at", { ascending: false });

      if (fleetFilter) {
        query = query.eq("frota_id", fleetFilter);
      }

      if (licensePlateFilter) {
        query = query.ilike("placa", `%${licensePlateFilter}%`);
      }

      const { data, error } = await query;

      if (error) {
        toast({
          variant: "destructive",
          title: "Erro ao carregar dados",
          description: error.message,
        });
        return [];
      }

      return data as TruckEquipment[];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("bd_caminhaoequipamento")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trucks-equipment"] });
      toast({
        title: "Item excluído com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erro ao excluir item",
        description: error.message,
      });
    },
  });

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Frota</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead>Modelo</TableHead>
          <TableHead>Placa</TableHead>
          <TableHead>Ano</TableHead>
          <TableHead>Capacidade</TableHead>
          <TableHead>Proprietário</TableHead>
          <TableHead>Descrição</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items?.map((item) => (
          <TableRow key={item.id}>
            <TableCell>
              {item.frota ? `${item.frota.frota} ${item.frota.numero}` : "-"}
            </TableCell>
            <TableCell>{item.tipo}</TableCell>
            <TableCell>{item.modelo}</TableCell>
            <TableCell>{item.placa || "-"}</TableCell>
            <TableCell>{item.ano || "-"}</TableCell>
            <TableCell>{item.capacidade || "-"}</TableCell>
            <TableCell>{item.proprietario || "-"}</TableCell>
            <TableCell>{item.descricao || "-"}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onEdit(item)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza que deseja excluir este item? Esta ação não
                        pode ser desfeita.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteMutation.mutate(item.id)}
                      >
                        Excluir
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}