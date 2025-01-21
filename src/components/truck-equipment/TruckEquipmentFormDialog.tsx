import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TruckEquipmentForm } from "./TruckEquipmentForm";
import type { TruckEquipment } from "./types";

interface TruckEquipmentFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: TruckEquipment | null;
}

export function TruckEquipmentFormDialog({
  open,
  onOpenChange,
  initialData,
}: TruckEquipmentFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Editar" : "Novo"} Caminhão/Equipamento
          </DialogTitle>
        </DialogHeader>
        <TruckEquipmentForm
          initialData={initialData}
          onSuccess={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}