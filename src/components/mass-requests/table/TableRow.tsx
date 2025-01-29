import { TableCell } from "@/components/ui/table";
import { MassRequest } from "../types";
import { TableActions } from "./TableActions";
import { cn } from "@/lib/utils";

interface TableRowProps {
  request: MassRequest;
  userPermission?: string;
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
}: TableRowProps) {
  const isProgrammed = request.quantidade_programada >= request.peso;

  return (
    <tr
      className={cn(
        "hover:bg-muted/50 data-[state=selected]:bg-muted",
        isProgrammed && "bg-green-50"
      )}
    >
      <TableCell>{request.centro_custo}</TableCell>
      <TableCell>{request.logradouro}</TableCell>
      <TableCell>{request.engenheiro}</TableCell>
      <TableCell>{request.area}</TableCell>
      <TableCell>{request.peso}</TableCell>
      <TableCell>{request.quantidade_programada}</TableCell>
      <TableCell>
        <TableActions
          request={request}
          userPermission={userPermission}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
          onNewProgramming={onNewProgramming}
        />
      </TableCell>
    </tr>
  );
}