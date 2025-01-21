import { TruckEquipmentForm } from "@/components/truck-equipment/TruckEquipmentForm";
import { TruckEquipmentTable } from "@/components/truck-equipment/TruckEquipmentTable";
import { useState } from "react";
import type { TruckEquipment } from "@/components/truck-equipment/types";

export default function TruckEquipmentManagement() {
  const [editingItem, setEditingItem] = useState<TruckEquipment | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Gerenciamento de Caminhões/Equipamentos</h2>
        <p className="text-muted-foreground">
          Cadastre e gerencie os caminhões e equipamentos da sua frota
        </p>
      </div>

      <TruckEquipmentForm
        initialData={editingItem}
        onSuccess={() => setEditingItem(null)}
      />

      <TruckEquipmentTable
        onEdit={(item) => setEditingItem(item)}
      />
    </div>
  );
}