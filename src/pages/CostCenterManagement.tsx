import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
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
import { CostCenterForm } from "@/components/cost-centers/CostCenterForm";

interface CostCenter {
  id: string;
  nome: string;
  created_at: string;
}

const ITEMS_PER_PAGE = 10;

export default function CostCenterManagement() {
  const [currentPage, setCurrentPage] = useState(1);
  const [editingCostCenter, setEditingCostCenter] = useState<CostCenter | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: costCenters, isLoading, error } = useQuery({
    queryKey: ["costCenters", currentPage],
    queryFn: async () => {
      console.log("Fetching cost centers...");

      const start = (currentPage - 1) * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE - 1;

      try {
        const { data, error } = await supabase
          .from("bd_centrocusto")
          .select("*")
          .range(start, end)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Supabase error:", error);
          toast({
            title: "Erro ao carregar centros de custo",
            description: error.message,
            variant: "destructive",
          });
          throw error;
        }

        console.log("Cost centers fetched:", data);
        return data as CostCenter[];
      } catch (err) {
        console.error("Failed to fetch cost centers:", err);
        throw err;
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("bd_centrocusto").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["costCenters"] });
      toast({
        title: "Centro de custo excluído com sucesso",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao excluir centro de custo",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleEdit = (costCenter: CostCenter) => {
    setEditingCostCenter(costCenter);
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleFormSuccess = () => {
    setEditingCostCenter(null);
  };

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">Gerenciamento de Centros de Custo</h1>
        <CostCenterForm
          editingCostCenter={editingCostCenter}
          onSuccess={handleFormSuccess}
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Data de Criação</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {costCenters?.map((costCenter) => (
              <TableRow key={costCenter.id}>
                <TableCell>{costCenter.nome}</TableCell>
                <TableCell>
                  {new Date(costCenter.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleEdit(costCenter)}
                  >
                    <Edit className="h-4 w-4" />
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
                          Tem certeza que deseja excluir este centro de custo? Esta ação não
                          pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(costCenter.id)}
                        >
                          Confirmar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4 flex justify-end space-x-2">
        <Button
          variant="outline"
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
        >
          Anterior
        </Button>
        <Button
          variant="outline"
          onClick={() => setCurrentPage((p) => p + 1)}
          disabled={!costCenters || costCenters.length < ITEMS_PER_PAGE}
        >
          Próximo
        </Button>
      </div>
    </div>
  );
}
