import { TableCell, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EmployeeFormValues } from "../types";

interface EmployeeTableRowProps {
  employee: any;
  onEdit: (employee: Partial<EmployeeFormValues>) => void;
  onView: (employee: Partial<EmployeeFormValues>) => void;
}

export const EmployeeTableRow = ({ employee, onEdit, onView }: EmployeeTableRowProps) => {
  const handleEdit = () => {
    const formattedEmployee: Partial<EmployeeFormValues> = {
      ...employee,
      escolaridade: employee.escolaridade || "Médio",
    };
    onEdit(formattedEmployee);
  };

  return (
    <TableRow>
      <TableCell>
        <Avatar>
          <AvatarImage src={employee.imagem} alt={employee.nome} />
          <AvatarFallback>{employee.nome?.charAt(0)}</AvatarFallback>
        </Avatar>
      </TableCell>
      <TableCell>{employee.nome}</TableCell>
      <TableCell>{employee.funcao?.nome}</TableCell>
      <TableCell>{employee.empresa_proprietaria?.nome}</TableCell>
      <TableCell>{employee.centro_custo?.nome}</TableCell>
      <TableCell>
        {employee.admissao ? format(new Date(employee.admissao), "dd/MM/yyyy") : "-"}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onView(employee)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleEdit}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};