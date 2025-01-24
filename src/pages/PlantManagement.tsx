import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlantForm } from "@/components/plants/PlantForm";
import { PlantTable } from "@/components/plants/PlantTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function PlantManagement() {
  const [selectedPlant, setSelectedPlant] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);

  const handleSuccess = () => {
    setShowForm(false);
    setSelectedPlant(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Gestão de Usinas</h2>
        <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> Adicionar Usina
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{selectedPlant ? "Editar Usina" : "Nova Usina"}</CardTitle>
          </CardHeader>
          <CardContent>
            <PlantForm
              initialData={selectedPlant}
              onSuccess={handleSuccess}
            />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Usinas Cadastradas</CardTitle>
        </CardHeader>
        <CardContent>
          <PlantTable
            onEdit={(plant) => {
              setSelectedPlant(plant);
              setShowForm(true);
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}