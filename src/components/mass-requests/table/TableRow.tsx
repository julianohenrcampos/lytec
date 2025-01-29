import { format } from "date-fns";
import { TableCell, TableRow as UITableRow } from "@/components/ui/table";
import { MassRequest } from "../types";
import { TableActions } from "./TableActions";
import { cn } from "@/lib/utils";
import { Truck } from "lucide-react";

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
    <UITableRow 
      className={cn(
        isProgrammed && "bg-green-50"
      )}
    >
      <TableCell>{format(new Date(request.data), "dd/MM/yyyy")}</TableCell>
      <TableCell>{request.centro_custo}</TableCell>
      <TableCell>{request.engenheiro}</TableCell>
      <TableCell>{request.area}</TableCell>
      <TableCell>{request.peso}</TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Truck className="h-4 w-4 text-gray-500" />
          {request.quantidade_programada}
        </div>
      </TableCell>
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