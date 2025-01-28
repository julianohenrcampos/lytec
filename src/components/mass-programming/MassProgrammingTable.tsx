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
import { Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MassProgrammingTableProps {
  onEdit: (program: any) => void;
}

export function MassProgrammingTable({ onEdit }: MassProgrammingTableProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: programs, isLoading } = useQuery({
    queryKey: ["massProgramming"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bd_programacaomassa")
        .select(`
          *,
          bd_centrocusto (nome),
          encarregado:bd_rhasfalto!bd_programacaomassa_encarregado_fkey (nome),
          apontador:bd_rhasfalto!bd_programacaomassa_apontador_fkey (nome)
        `)
        .order("data_entrega", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

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

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="rounded-md border">
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
          {programs?.map((program) => (
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
                  variant="outline"
                  size="icon"
                  onClick={() => onEdit(program)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
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