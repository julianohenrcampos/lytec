import React, { useState } from "react";
import { EmployeeFormDialog } from "@/components/employees/EmployeeFormDialog";
import { EmployeeTable } from "@/components/employees/EmployeeTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const EmployeeManagement = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Gerenciamento de Funcionários</CardTitle>
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