import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { EmployeeFormValues } from "../types";

interface EmployeeActionsProps {
  employee: any;
  onEdit: (employee: Partial<EmployeeFormValues>) => void;
}

export const EmployeeActions = ({ employee, onEdit }: EmployeeActionsProps) => {
  return (
    <div className="flex justify-end space-x-2">
      <Button
        variant="outline"
        size="icon"
        onClick={() => onEdit(employee)}
      >
        <Pencil className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon">
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};