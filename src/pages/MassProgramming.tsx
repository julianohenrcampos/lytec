import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MassProgrammingForm } from "@/components/mass-programming/MassProgrammingForm";
import { MassProgrammingTable } from "@/components/mass-programming/MassProgrammingTable";
import { MassProgrammingFilters } from "@/components/mass-programming/MassProgrammingFilters";
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
  const [filters, setFilters] = useState({
    date: null as Date | null,
    costCenter: "_all",
    manager: "_all",
  });

  const { data: programs, isLoading } = useQuery({
    queryKey: ["massProgramming", filters],
    queryFn: async () => {
      let query = supabase
        .from("bd_programacaomassa")
        .select(`
          *,
          bd_centrocusto (nome),
          encarregado:bd_rhasfalto!bd_programacaomassa_encarregado_fkey (nome),
          apontador:bd_rhasfalto!bd_programacaomassa_apontador_fkey (nome)
        `)
        .order("data_entrega", { ascending: false });

      if (filters.date) {
        query = query.eq("data_entrega", filters.date.toISOString());
      }

      if (filters.costCenter !== "_all") {
        query = query.eq("bd_centrocusto.nome", filters.costCenter);
      }

      if (filters.manager !== "_all") {
        query = query.eq("encarregado", filters.manager);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const handleEdit = (program: any) => {
    setEditingProgram(program);
    setIsOpen(true);
  };

  const handleSuccess = () => {
    setIsOpen(false);
    setEditingProgram(null);
  };

  return (
    <div className="w-full">
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

      <MassProgrammingFilters filters={filters} onFilterChange={setFilters} />
      
      {isLoading ? (
        <div>Carregando...</div>
      ) : (
        <MassProgrammingTable data={programs} onEdit={handleEdit} />
      )}
    </div>
  );
}