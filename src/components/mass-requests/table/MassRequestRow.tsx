import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Pencil, Trash2, ChevronDown, ChevronRight } from "lucide-react";
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

interface MassRequestRowProps {
  request: MassRequest;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onEdit: (request: MassRequest) => void;
  onDelete: (id: string) => void;
}

export function MassRequestRow({
  request,
  isExpanded,
  onToggleExpand,
  onEdit,
  onDelete,
}: MassRequestRowProps) {
  return (
    <TableRow className="bg-muted/5">
      <TableCell>
        {request.streets && request.streets.length > 0 && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleExpand}
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        )}
      </TableCell>
      <TableCell className="font-medium">{request.centro_custo}</TableCell>
      <TableCell>{request.diretoria || "-"}</TableCell>
      <TableCell>{request.engenheiro}</TableCell>
      <TableCell>{format(new Date(request.data), "dd/MM/yyyy")}</TableCell>
      <TableCell>{request.logradouro}</TableCell>
      <TableCell>{request.bairro || "-"}</TableCell>
      <TableCell className="text-center">{request.area.toFixed(2)}</TableCell>
      <TableCell className="text-center">{request.peso.toFixed(2)}</TableCell>
      <TableCell>{request.traco || "-"}</TableCell>
      <TableCell>{request.ligante || "-"}</TableCell>
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
                  onClick={() => onDelete(request.id)}
                >
                  Excluir
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </TableCell>
    </TableRow>
  );
}