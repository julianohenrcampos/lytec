import { useState } from "react";
import { MassRequestForm } from "@/components/mass-requests/MassRequestForm";
import { MassRequestTable } from "@/components/mass-requests/MassRequestTable";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";

export default function MassRequestManagement() {
  const [isOpen, setIsOpen] = useState(false);
  const [editingRequest, setEditingRequest] = useState<any>(null);

  const handleEdit = (request: any) => {
    setEditingRequest(request);
    setIsOpen(true);
  };

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

      <MassRequestTable onEdit={handleEdit} />
    </div>
  );
}