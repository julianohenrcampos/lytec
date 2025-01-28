import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit2, Eye, Trash2 } from "lucide-react";
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
import { useNavigate } from "react-router-dom";

interface TeamTableProps {
  filters: {
    teamName: string;
  };
  onEdit: (team: any) => void;
}

export function TeamTable({ filters, onEdit }: TeamTableProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: teams, isLoading } = useQuery({
    queryKey: ["teams", filters],
    queryFn: async () => {
      let query = supabase
        .from("bd_equipe")
        .select(`
          *,
          encarregado:bd_rhasfalto!bd_equipe_encarregado_id_fkey(nome),
          apontador:bd_rhasfalto!bd_equipe_apontador_id_fkey(nome)
        `);

      if (filters.teamName) {
        query = query.ilike("nome", `%${filters.teamName}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("bd_equipe")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      toast({
        title: "Equipe excluída com sucesso!",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Erro ao excluir equipe",
        description: error.message,
      });
    },
  });

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome da Equipe</TableHead>
            <TableHead>Encarregado</TableHead>
            <TableHead>Apontador</TableHead>
            <TableHead>Colaboradores</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {teams?.map((team) => (
            <TableRow key={team.id}>
              <TableCell>{team.nome}</TableCell>
              <TableCell>{team.encarregado?.nome}</TableCell>
              <TableCell>{team.apontador?.nome}</TableCell>
              <TableCell>{team.colaboradores?.length || 0} membros</TableCell>
              <TableCell>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate(`/teams/${team.id}`)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(team)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja excluir esta equipe? Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteMutation.mutate(team.id)}
                        >
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
    </div>
  );
}