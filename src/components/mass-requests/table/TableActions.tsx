import { Button } from "@/components/ui/button";
import { Eye, Pencil, List, Trash } from "lucide-react";
import { MassRequest } from "../types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MassProgrammingForm } from "@/components/mass-programming/MassProgrammingForm";
import { useState } from "react";

interface TableActionsProps {
  request: MassRequest;
  userPermission?: string;
  onView: (request: MassRequest) => void;
  onEdit: (request: MassRequest) => void;
  onDelete: (request: MassRequest) => void;
  onNewProgramming: (request: MassRequest) => void;
}

export function TableActions({
  request,
  userPermission,
  onView,
  onEdit,
  onDelete,
  onNewProgramming,
}: TableActionsProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const isProgrammed = request.quantidade_programada >= request.peso;

  const handleProgrammingSuccess = () => {
    setIsDialogOpen(false);
    onNewProgramming(request);
  };

  return (
    <div className="flex justify-end items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onView(request)}
        title="Visualizar"
        disabled={isProgrammed}
      >
        <Eye className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onEdit(request)}
        title="Editar"
        disabled={isProgrammed}
      >
        <Pencil className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete(request)}
        title="Excluir"
        disabled={isProgrammed}
      >
        <Trash className="h-4 w-4" />
      </Button>
      {userPermission === "planejamento" && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              title="Nova Programação"
              disabled={isProgrammed}
            >
              <List className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Nova Programação</DialogTitle>
            </DialogHeader>
            <MassProgrammingForm
              initialData={{
                centro_custo_id: request.centro_custo,
                logradouro: request.logradouro,
                volume: request.peso - (request.quantidade_programada || 0),
                requisicao_id: request.id,
              }}
              onSuccess={handleProgrammingSuccess}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}