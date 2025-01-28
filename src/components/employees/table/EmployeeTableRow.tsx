import { TableCell, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { EmployeeActions } from "./EmployeeActions";
import { EmployeeFormValues } from "../types";
import { validateEscolaridade } from "../utils/validation";

interface EmployeeTableRowProps {
  employee: any;
  onEdit: (employee: Partial<EmployeeFormValues>) => void;
}

export const EmployeeTableRow = ({ employee, onEdit }: EmployeeTableRowProps) => {
  const handleEdit = () => {
    const formattedEmployee: Partial<EmployeeFormValues> = {
      ...employee,
      escolaridade: validateEscolaridade(employee.escolaridade),
    };
    onEdit(formattedEmployee);
  };

  return (
    <TableRow>
      <TableCell>{employee.nome}</TableCell>
      <TableCell>{employee.funcao?.nome}</TableCell>
      <TableCell>{employee.empresa?.nome}</TableCell>
      <TableCell>{employee.empresa_proprietaria?.nome}</TableCell>
      <TableCell>{employee.centro_custo?.nome}</TableCell>
      <TableCell>
        {employee.admissao ? format(new Date(employee.admissao), "dd/MM/yyyy") : "-"}
      </TableCell>
      <TableCell className="text-right">
        <EmployeeActions employee={employee} onEdit={handleEdit} />
      </TableCell>
    </TableRow>
  );
};