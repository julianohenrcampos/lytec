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
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
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
import { Edit, Eye, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface MassProgrammingTableProps {
  data: any[];
  onEdit: (program: any) => void;
}

export function MassProgrammingTable({ data, onEdit }: MassProgrammingTableProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("bd_programacaomassa")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Programação excluída com sucesso",
        variant: "default",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao excluir programação",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Data de Entrega</TableHead>
            <TableHead>Tipo de Lançamento</TableHead>
            <TableHead>Usina</TableHead>
            <TableHead>Centro de Custo</TableHead>
            <TableHead>Logradouro</TableHead>
            <TableHead>Encarregado</TableHead>
            <TableHead>Apontador</TableHead>
            <TableHead>Caminhão</TableHead>
            <TableHead>Volume (t)</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((program) => (
            <TableRow key={program.id}>
              <TableCell>
                {format(new Date(program.data_entrega), "dd/MM/yyyy")}
              </TableCell>
              <TableCell>{program.tipo_lancamento}</TableCell>
              <TableCell>{program.usina}</TableCell>
              <TableCell>{program.bd_centrocusto.nome}</TableCell>
              <TableCell>{program.logradouro}</TableCell>
              <TableCell>{program.encarregado.nome}</TableCell>
              <TableCell>{program.apontador.nome}</TableCell>
              <TableCell>{program.caminhao}</TableCell>
              <TableCell>{program.volume}</TableCell>
              <TableCell className="text-right space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate(`/mass-programming/${program.id}`)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(program)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedId(program.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Confirmar exclusão
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza que deseja excluir esta programação?
                        Esta ação não pode ser desfeita.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel
                        onClick={() => setSelectedId(null)}
                      >
                        Cancelar
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => {
                          if (selectedId) {
                            handleDelete(selectedId);
                          }
                        }}
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
  );
}