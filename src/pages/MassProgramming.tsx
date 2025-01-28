import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MassProgrammingForm } from "@/components/mass-programming/MassProgrammingForm";
import { MassProgrammingTable } from "@/components/mass-programming/MassProgrammingTable";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function MassProgramming() {
  const [isOpen, setIsOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<any>(null);

  const handleEdit = (program: any) => {
    setEditingProgram(program);
    setIsOpen(true);
  };

  const handleSuccess = () => {
    setIsOpen(false);
    setEditingProgram(null);
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Programação de Massa</h1>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nova Programação
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>
                {editingProgram ? "Editar Programação" : "Nova Programação"}
              </DialogTitle>
            </DialogHeader>
            <MassProgrammingForm
              initialData={editingProgram}
              onSuccess={handleSuccess}
            />
          </DialogContent>
        </Dialog>
      </div>

      <MassProgrammingTable onEdit={handleEdit} />
    </div>
  );
}