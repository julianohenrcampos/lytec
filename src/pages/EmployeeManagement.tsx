import React, { useState } from "react";
import { EmployeeFormDialog } from "@/components/employees/EmployeeFormDialog";
import { EmployeeTable } from "@/components/employees/EmployeeTable";
import { EmployeeFilters } from "@/components/employees/EmployeeFilters";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { EmployeeFormValues } from "@/components/employees/types";
import { EmployeeViewDialog } from "@/components/employees/EmployeeViewDialog";

const EmployeeManagement = () => {
  const [formOpen, setFormOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Partial<EmployeeFormValues> | undefined>(undefined);
  const [filters, setFilters] = useState({
    nome: "",
    funcao: "_all",
    centro_custo: "_all",
  });

  const handleEdit = (employee: Partial<EmployeeFormValues>) => {
    setSelectedEmployee(employee);
    setFormOpen(true);
  };

  const handleView = (employee: Partial<EmployeeFormValues>) => {
    setSelectedEmployee(employee);
    setViewOpen(true);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <EmployeeFilters 
            filters={filters}
            onFilterChange={setFilters}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Lista de Funcionários</CardTitle>
          <Button onClick={() => setFormOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Cadastrar Funcionário
          </Button>
        </CardHeader>
        <CardContent>
          <EmployeeTable 
            filters={filters}
            onEdit={handleEdit}
            onView={handleView}
          />
        </CardContent>
      </Card>

      <EmployeeFormDialog 
        open={formOpen} 
        onOpenChange={setFormOpen} 
        initialData={selectedEmployee}
      />

      <EmployeeViewDialog
        open={viewOpen}
        onOpenChange={setViewOpen}
        employee={selectedEmployee}
      />
    </div>
  );
};

export default EmployeeManagement;