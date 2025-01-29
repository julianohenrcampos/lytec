import { useState } from "react";
import { MassRequestFilters } from "@/components/mass-requests/MassRequestFilters";
import { MassRequestTable } from "@/components/mass-requests/MassRequestTable";
import { MassRequestForm } from "@/components/mass-requests/MassRequestForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { MassRequest } from "@/components/mass-requests/types";

interface Filters {
  startDate: Date | null;
  endDate: Date | null;
  engineer: string;
  costCenter: string;
}

export default function MassRequestManagement() {
  const [isOpen, setIsOpen] = useState(false);
  const [editingRequest, setEditingRequest] = useState<MassRequest | null>(null);
  const [filters, setFilters] = useState<Filters>({
    startDate: null,
    endDate: null,
    engineer: "_all",
    costCenter: "_all",
  });

  const handleSuccess = () => {
    setIsOpen(false);
    setEditingRequest(null);
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gerenciamento de Requisições de Massa</h1>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nova Requisição
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingRequest ? "Editar Requisição" : "Nova Requisição"}
              </DialogTitle>
            </DialogHeader>
            <MassRequestForm
              initialData={editingRequest}
              onSuccess={handleSuccess}
            />
          </DialogContent>
        </Dialog>
      </div>

      <MassRequestFilters filters={filters} onFilterChange={setFilters} />
      
      <MassRequestTable filters={filters} />
    </div>
  );
}