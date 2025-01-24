import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Plant {
  id: string;
  usina: string;
  endereco: string | null;
  producao_total: number | null;
  created_at: string;
}

interface PlantTableProps {
  onEdit: (plant: Plant) => void;
}

export function PlantTable({ onEdit }: PlantTableProps) {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const { toast } = useToast();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["plants", page],
    queryFn: async () => {
      const { data, error, count } = await supabase
        .from("bd_usinas")
        .select("*", { count: "exact" })
        .range((page - 1) * pageSize, page * pageSize - 1)
        .order("created_at", { ascending: false });

      if (error) throw error;

      return {
        plants: data as Plant[],
        total: count || 0,
      };
    },
  });

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("bd_usinas")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({ title: "Usina excluída com sucesso!" });
      refetch();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao excluir",
        description: "Ocorreu um erro ao excluir a usina.",
      });
    }
  };

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  const totalPages = Math.ceil((data?.total || 0) / pageSize);

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome da Usina</TableHead>
            <TableHead>Endereço</TableHead>
            <TableHead>Produção Total (T)</TableHead>
            <TableHead>Data de Criação</TableHead>
            <TableHead className="w-[100px]">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.plants.map((plant) => (
            <TableRow key={plant.id}>
              <TableCell>{plant.usina}</TableCell>
              <TableCell>{plant.endereco || "-"}</TableCell>
              <TableCell>{plant.producao_total?.toLocaleString() || "-"}</TableCell>
              <TableCell>
                {format(new Date(plant.created_at), "dd/MM/yyyy HH:mm")}
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(plant)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Trash className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja excluir esta usina? Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(plant.id)}>
                          Confirmar
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

      <div className="flex justify-end space-x-2">
        <Button
          variant="outline"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Anterior
        </Button>
        <Button
          variant="outline"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page >= totalPages}
        >
          Próxima
        </Button>
      </div>
    </div>
  );
}