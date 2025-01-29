import { format } from "date-fns";
import { TableCell, TableRow as UITableRow } from "@/components/ui/table";
import { MassRequest } from "../types";
import { TableActions } from "./TableActions";

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
  return (
    <UITableRow>
      <TableCell>{format(new Date(request.data), "dd/MM/yyyy")}</TableCell>
      <TableCell>{request.centro_custo}</TableCell>
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
    </UITableRow>
  );
}