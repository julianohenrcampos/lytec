import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormLabel } from "@/components/ui/form";
import { Search, Plus, X } from "lucide-react";

interface Employee {
  id: string;
  nome: string;
  matricula: string;
}

interface CollaboratorSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filteredEmployees: Employee[] | undefined;
  selectedEmployees: string[];
  onAddEmployee: (id: string) => void;
  onRemoveEmployee: (id: string) => void;
  employees: Employee[] | undefined;
}

export const CollaboratorSearch = ({
  searchTerm,
  onSearchChange,
  filteredEmployees,
  selectedEmployees,
  onAddEmployee,
  onRemoveEmployee,
  employees,
}: CollaboratorSearchProps) => {
  return (
    <div className="space-y-2">
      <FormLabel>Colaboradores</FormLabel>
      <div className="flex gap-2">
        <Input
          placeholder="Buscar colaborador..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="flex-1"
        />
        <Button type="button" variant="outline">
          <Search className="h-4 w-4" />
        </Button>
      </div>

      <div className="border rounded-md p-2 min-h-[100px] space-y-2">
        {selectedEmployees.map((employeeId) => {
          const employee = employees?.find((e) => e.id === employeeId);
          return (
            <div
              key={employeeId}
              className="flex items-center justify-between bg-secondary p-2 rounded-md"
            >
              <span>{employee?.nome}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onRemoveEmployee(employeeId)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          );
        })}
      </div>

      {searchTerm && (
        <div className="border rounded-md mt-2">
          {filteredEmployees?.map((employee) => (
            <div
              key={employee.id}
              className="p-2 hover:bg-secondary cursor-pointer flex justify-between items-center"
            >
              <span>
                {employee.nome} - {employee.matricula}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onAddEmployee(employee.id)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};