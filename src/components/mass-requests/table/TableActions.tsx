import { Button } from "@/components/ui/button";
import { Eye, Pencil, Plus, Trash } from "lucide-react";
import { MassRequest } from "../types";

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
  return (
    <div className="flex justify-end items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onView(request)}
        title="Visualizar"
      >
        <Eye className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onEdit(request)}
        title="Editar"
      >
        <Pencil className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete(request)}
        title="Excluir"
      >
        <Trash className="h-4 w-4" />
      </Button>
      {userPermission === "planejamento" && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onNewProgramming(request)}
          title="Nova Programação"
        >
          <Plus className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}