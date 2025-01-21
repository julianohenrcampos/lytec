import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { TruckEquipmentTable } from "@/components/truck-equipment/TruckEquipmentTable";
import { TruckEquipmentFormDialog } from "@/components/truck-equipment/TruckEquipmentFormDialog";
import { supabase } from "@/integrations/supabase/client";
import type { TruckEquipment } from "@/components/truck-equipment/types";

export default function TruckEquipmentManagement() {
  const [open, setOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TruckEquipment | null>(null);
  const [selectedFleet, setSelectedFleet] = useState<string>("");
  const [licensePlate, setLicensePlate] = useState("");

  const { data: fleets } = useQuery({
    queryKey: ["fleets"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bd_frota")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleEdit = (item: TruckEquipment) => {
    setEditingItem(item);
    setOpen(true);
  };

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    if (!open) {
      setEditingItem(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Gerenciamento de Caminhões/Equipamentos
          </h2>
          <p className="text-muted-foreground">
            Cadastre e gerencie os caminhões e equipamentos da sua frota
          </p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="w-[200px]">
          <Select
            value={selectedFleet}
            onValueChange={setSelectedFleet}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por frota" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todas as frotas</SelectItem>
              {fleets?.map((fleet) => (
                <SelectItem key={fleet.id} value={fleet.id}>
                  {`${fleet.frota} ${fleet.numero}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-[200px]">
          <Input
            placeholder="Filtrar por placa"
            value={licensePlate}
            onChange={(e) => setLicensePlate(e.target.value)}
          />
        </div>
      </div>

      <TruckEquipmentTable
        onEdit={handleEdit}
        fleetFilter={selectedFleet}
        licensePlateFilter={licensePlate}
      />

      <TruckEquipmentFormDialog
        open={open}
        onOpenChange={handleOpenChange}
        initialData={editingItem}
      />
    </div>
  );
}