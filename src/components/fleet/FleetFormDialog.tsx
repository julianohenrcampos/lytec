import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { FleetForm } from "./FleetForm";
import type { Database } from "@/integrations/supabase/types";

type Fleet = Database["public"]["Tables"]["bd_frota"]["Row"];

interface FleetFormDialogProps {
  initialData?: Fleet;
  onOpenChange?: (open: boolean) => void;
}

export function FleetFormDialog({ initialData, onOpenChange }: FleetFormDialogProps) {
  const [open, setOpen] = useState(false);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    onOpenChange?.(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          {initialData ? "Editar Frota" : "Adicionar Frota"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Editar Frota" : "Nova Frota"}
          </DialogTitle>
        </DialogHeader>
        <FleetForm
          onSubmit={(values) => {
            handleOpenChange(false);
          }}
          initialData={initialData}
        />
      </DialogContent>
    </Dialog>
  );
}