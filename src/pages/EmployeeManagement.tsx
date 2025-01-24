import React, { useState } from "react";
import { EmployeeFormDialog } from "@/components/employees/EmployeeFormDialog";
import { EmployeeTable } from "@/components/employees/EmployeeTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const EmployeeManagement = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Gerenciamento de Funcionários</CardTitle>
          <Button onClick={() => setOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Cadastrar Funcionário
          </Button>
          <EmployeeFormDialog open={open} onOpenChange={setOpen} />
        </CardHeader>
        <CardContent>
          <EmployeeTable />
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeManagement;