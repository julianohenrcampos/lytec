import { format } from "date-fns";
import { Edit, Eye, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
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
import { MassRequest } from "../types";

interface MassRequestTableRowProps {
  request: MassRequest;
  userPermission?: string | null;
  onView: (request: MassRequest) => void;
  onEdit: (request: MassRequest) => void;
  onDelete: (request: MassRequest) => void;
  onNewProgramming: (request: MassRequest) => void;
}

export function MassRequestTableRow({
  request,
  userPermission,
  onView,
  onEdit,
  onDelete,
  onNewProgramming,
}: MassRequestTableRowProps) {
  return (
    <TableRow>
      <TableCell>{format(new Date(request.data), "dd/MM/yyyy")}</TableCell>
      <TableCell>{request.centro_custo}</TableCell>
      <TableCell>{request.diretoria || "-"}</TableCell>
      <TableCell>{request.gerencia || "-"}</TableCell>
      <TableCell>{request.engenheiro}</TableCell>
      <TableCell>{request.logradouro}</TableCell>
      <TableCell>{request.bairro || "-"}</TableCell>
      <TableCell>{request.area?.toFixed(2) || "-"}</TableCell>
      <TableCell>{request.peso?.toFixed(2) || "-"}</TableCell>
      <TableCell>{request.quantidade_programada?.toFixed(2) || "0.00"}</TableCell>
      <TableCell>{request.traco || "-"}</TableCell>
      <TableCell>{request.ligante || "-"}</TableCell>
      <TableCell className="text-right space-x-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onView(request)}
        >
          <Eye className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onEdit(request)}
        >
          <Edit className="h-4 w-4" />
        </Button>
        {userPermission === "planejamento" && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onNewProgramming(request)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        )}
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
                Tem certeza que deseja excluir esta requisição?
                Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={() => onDelete(request)}>
                Confirmar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </TableCell>
    </TableRow>
  );
}