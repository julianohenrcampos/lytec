import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";

interface FiltersProps {
  filters: {
    date: Date | null;
    costCenter: string;
    manager: string;
  };
  onFilterChange: (filters: any) => void;
}

export function MassProgrammingFilters({ filters, onFilterChange }: FiltersProps) {
  const { data: costCenters } = useQuery({
    queryKey: ["costCenters"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bd_centrocusto")
        .select("id, nome")
        .order("nome");

      if (error) throw error;
      return data;
    },
  });

  const { data: managers } = useQuery({
    queryKey: ["managers"],
    queryFn: async () => {
      const { data: funcao } = await supabase
        .from("bd_funcao")
        .select("id")
        .eq("nome", "encarregado")
        .single();

      if (!funcao) return [];

      const { data, error } = await supabase
        .from("bd_rhasfalto")
        .select("id, nome")
        .eq("funcao_id", funcao.id)
        .order("nome");

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <div className="flex justify-end items-center gap-2 mb-4">
        <Filter className="h-4 w-4" />
        <h2 className="text-sm font-medium">Filtros</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Data</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                {filters.date ? (
                  format(filters.date, "dd/MM/yyyy")
                ) : (
                  <span>Selecione uma data</span>
                )}
                <Calendar className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={filters.date || undefined}
                onSelect={(date) =>
                  onFilterChange({ ...filters, date })
                }
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Centro de Custo</label>
          <Select
            value={filters.costCenter}
            onValueChange={(value) =>
              onFilterChange({ ...filters, costCenter: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione um centro de custo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="_all">Todos</SelectItem>
              {costCenters?.map((cc) => (
                <SelectItem key={cc.id} value={cc.nome}>
                  {cc.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Encarregado</label>
          <Select
            value={filters.manager}
            onValueChange={(value) =>
              onFilterChange({ ...filters, manager: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione um encarregado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="_all">Todos</SelectItem>
              {managers?.map((manager) => (
                <SelectItem key={manager.id} value={manager.id}>
                  {manager.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-end">
          <Button
            variant="outline"
            className="w-full"
            onClick={() =>
              onFilterChange({
                date: null,
                costCenter: "_all",
                manager: "_all",
              })
            }
          >
            Limpar Filtros
          </Button>
        </div>
      </div>
    </div>
  );
}