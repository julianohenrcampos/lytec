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
import { FunctionForm } from "@/components/functions/FunctionForm";

interface Function {
  id: string;
  nome: string;
  created_at: string;
}

const ITEMS_PER_PAGE = 10;

export default function FunctionManagement() {
  const [currentPage, setCurrentPage] = useState(1);
  const [editingFunction, setEditingFunction] = useState<Function | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: functions, isLoading } = useQuery({
    queryKey: ["functions", currentPage],
    queryFn: async () => {
      const start = (currentPage - 1) * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE - 1;

      const { data, error } = await supabase
        .from("bd_funcao")
        .select("*")
        .range(start, end)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Function[];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("bd_funcao").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["functions"] });
      toast({
        title: "Função excluída com sucesso",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao excluir função",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleEdit = (func: Function) => {
    setEditingFunction(func);
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleFormSuccess = () => {
    setEditingFunction(null);
  };

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">Gerenciamento de Funções</h1>
        <FunctionForm
          editingFunction={editingFunction}
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
            {functions?.map((func) => (
              <TableRow key={func.id}>
                <TableCell>{func.nome}</TableCell>
                <TableCell>
                  {new Date(func.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleEdit(func)}
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
                          Tem certeza que deseja excluir esta função? Esta ação não
                          pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(func.id)}
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
          disabled={!functions || functions.length < ITEMS_PER_PAGE}
        >
          Próximo
        </Button>
      </div>
    </div>
  );
}