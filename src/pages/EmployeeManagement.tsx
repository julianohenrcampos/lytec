import React, { useState } from "react";
import { EmployeeFormDialog } from "@/components/employees/EmployeeFormDialog";
import { EmployeeTable } from "@/components/employees/EmployeeTable";
import { EmployeeFilters } from "@/components/employees/EmployeeFilters";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { EmployeeFormValues } from "@/components/employees/types";

const EmployeeManagement = () => {
  const [open, setOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Partial<EmployeeFormValues> | undefined>(undefined);
  const [filters, setFilters] = useState({
    nome: "",
    funcao: "_all",
    centro_custo: "_all",
  });

  const handleEdit = (employee: Partial<EmployeeFormValues>) => {
    setSelectedEmployee(employee);
    setOpen(true);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Gerenciamento de Funcionários</CardTitle>
          <Button onClick={() => setOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Cadastrar Funcionário
          </Button>
          <EmployeeFormDialog 
            open={open} 
            onOpenChange={setOpen} 
            initialData={selectedEmployee}
          />
        </CardHeader>
        <CardContent>
          <EmployeeFilters 
            filters={filters}
            onFilterChange={setFilters}
          />
          <EmployeeTable 
            filters={filters}
            onEdit={handleEdit}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeManagement;