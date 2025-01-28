import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MassProgrammingForm } from "@/components/mass-programming/MassProgrammingForm";
import { MassProgrammingTable } from "@/components/mass-programming/MassProgrammingTable";

export default function MassProgramming() {
  const [selectedProgram, setSelectedProgram] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleSuccess = () => {
    setIsOpen(false);
    setSelectedProgram(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Programação de Massa</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Nova Programação</CardTitle>
        </CardHeader>
        <CardContent>
          <MassProgrammingForm
            initialData={selectedProgram}
            onSuccess={handleSuccess}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Programações Cadastradas</CardTitle>
        </CardHeader>
        <CardContent>
          <MassProgrammingTable
            onEdit={(program) => {
              setSelectedProgram(program);
              setIsOpen(true);
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}