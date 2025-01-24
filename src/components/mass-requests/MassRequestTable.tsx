import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
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
import { Pencil, Trash2 } from "lucide-react";

interface MassRequest {
  id: string;
  centro_custo: string;
  diretoria?: string;
  gerencia?: string;
  engenheiro: string;
  data: string;
  logradouro: string;
  bairro?: string;
  largura: number;
  comprimento: number;
  ligante?: string;
  area: number;
  espessura: number;
  peso: number;
  created_at: string;
}

interface MassRequestTableProps {
  onEdit: (request: MassRequest) => void;
}

export function MassRequestTable({ onEdit }: MassRequestTableProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: requests, isLoading } = useQuery({
    queryKey: ["mass-requests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bd_requisicao")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        toast({
          variant: "destructive",
          title: "Erro ao carregar requisições",
          description: error.message,
        });
        return [];
      }

      return data as MassRequest[];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("bd_requisicao")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mass-requests"] });
      toast({
        title: "Requisição excluída com sucesso!",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Erro ao excluir requisição",
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
          <TableHead>Centro de Custo</TableHead>
          <TableHead>Diretoria</TableHead>
          <TableHead>Engenheiro</TableHead>
          <TableHead>Data</TableHead>
          <TableHead>Logradouro</TableHead>
          <TableHead>Bairro</TableHead>
          <TableHead>Área (m²)</TableHead>
          <TableHead>Peso (t)</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {requests?.map((request) => (
          <TableRow key={request.id}>
            <TableCell>{request.centro_custo}</TableCell>
            <TableCell>{request.diretoria || "-"}</TableCell>
            <TableCell>{request.engenheiro}</TableCell>
            <TableCell>{format(new Date(request.data), "dd/MM/yyyy")}</TableCell>
            <TableCell>{request.logradouro}</TableCell>
            <TableCell>{request.bairro || "-"}</TableCell>
            <TableCell>{request.area.toFixed(2)}</TableCell>
            <TableCell>{request.peso.toFixed(2)}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onEdit(request)}
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
                        Tem certeza que deseja excluir esta requisição? Esta ação
                        não pode ser desfeita.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteMutation.mutate(request.id)}
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