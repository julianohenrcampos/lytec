import { format } from "date-fns";
import { Table, TableBody } from "@/components/ui/table";
import { MassRequestTableHeader } from "./table/TableHeader";
import { Button } from "@/components/ui/button";
import { Edit2, Eye, Trash2 } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface MassRequestTableProps {
  data: any[];
  onEdit: (request: any) => void;
}

export function MassRequestTable({ data, onEdit }: MassRequestTableProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

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

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <MassRequestTableHeader />
        <TableBody>
          {data?.map((request) => (
            <TableRow key={request.id}>
              <TableCell>{format(new Date(request.data), "dd/MM/yyyy")}</TableCell>
              <TableCell>{request.centro_custo}</TableCell>
              <TableCell>{request.diretoria || "-"}</TableCell>
              <TableCell>{request.gerencia || "-"}</TableCell>
              <TableCell>{request.engenheiro}</TableCell>
              <TableCell>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate(`/mass-requests/${request.id}`)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(request)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteMutation.mutate(request.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}