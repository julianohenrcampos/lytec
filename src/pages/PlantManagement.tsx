import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlantForm } from "@/components/plants/PlantForm";
import { PlantTable } from "@/components/plants/PlantTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function PlantManagement() {
  const [selectedPlant, setSelectedPlant] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleSuccess = () => {
    setIsOpen(false);
    setSelectedPlant(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Gestão de Usinas</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" /> Adicionar Usina
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{selectedPlant ? "Editar Usina" : "Nova Usina"}</DialogTitle>
              <DialogDescription>
                Preencha os dados da usina nos campos abaixo.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-6">
              <PlantForm
                initialData={selectedPlant}
                onSuccess={handleSuccess}
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Usinas Cadastradas</CardTitle>
        </CardHeader>
        <CardContent>
          <PlantTable
            onEdit={(plant) => {
              setSelectedPlant(plant);
              setIsOpen(true);
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}