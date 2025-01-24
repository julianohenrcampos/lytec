import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlantForm } from "@/components/plants/PlantForm";
import { PlantTable } from "@/components/plants/PlantTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

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
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" /> Adicionar Usina
            </Button>
          </SheetTrigger>
          <SheetContent className="w-full sm:max-w-lg">
            <SheetHeader>
              <SheetTitle>{selectedPlant ? "Editar Usina" : "Nova Usina"}</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <PlantForm
                initialData={selectedPlant}
                onSuccess={handleSuccess}
              />
            </div>
          </SheetContent>
        </Sheet>
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