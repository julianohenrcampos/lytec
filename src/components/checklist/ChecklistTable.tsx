import { format } from "date-fns";
import { Eye, Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Checklist {
  id: string;
  data: string;
  hora_inicial: string;
  caminhao_equipamento: {
    tipo: string;
    modelo: string;
  };
  centro_custo: {
    nome: string;
  };
}

interface ChecklistTableProps {
  checklists: Checklist[];
  canEditDelete: (checklist: Checklist) => boolean;
  onView: (checklist: Checklist) => void;
  onEdit: (checklist: Checklist) => void;
  onDelete: (checklist: Checklist) => void;
}

export function ChecklistTable({
  checklists,
  canEditDelete,
  onView,
  onEdit,
  onDelete,
}: ChecklistTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Data</TableHead>
          <TableHead>Hora Inicial</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead>Modelo</TableHead>
          <TableHead>Centro de Custo</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {checklists.map((checklist) => (
          <TableRow key={checklist.id}>
            <TableCell>{format(new Date(checklist.data), "dd/MM/yyyy")}</TableCell>
            <TableCell>{checklist.hora_inicial}</TableCell>
            <TableCell>{checklist.caminhao_equipamento.tipo}</TableCell>
            <TableCell>{checklist.caminhao_equipamento.modelo}</TableCell>
            <TableCell>{checklist.centro_custo.nome}</TableCell>
            <TableCell className="text-right space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onView(checklist)}
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(checklist)}
                disabled={!canEditDelete(checklist)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(checklist)}
                disabled={!canEditDelete(checklist)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}