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
    startDate: Date | null;
    endDate: Date | null;
    engineer: string;
    costCenter: string;
  };
  onFilterChange: (filters: any) => void;
}

export function MassRequestFilters({ filters, onFilterChange }: FiltersProps) {
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

  const { data: engineers } = useQuery({
    queryKey: ["engineers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bd_requisicao")
        .select("engenheiro")
        .order("engenheiro");

      if (error) throw error;
      
      // Get unique engineers
      const uniqueEngineers = [...new Set(data.map(item => item.engenheiro))];
      return uniqueEngineers;
    },
  });

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="h-4 w-4" />
        <h2 className="text-sm font-medium">Filtros</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Período</label>
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  {filters.startDate ? (
                    format(filters.startDate, "dd/MM/yyyy")
                  ) : (
                    <span>Data inicial</span>
                  )}
                  <Calendar className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={filters.startDate || undefined}
                  onSelect={(date) =>
                    onFilterChange({ ...filters, startDate: date })
                  }
                />
              </PopoverContent>
            </Popover>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  {filters.endDate ? (
                    format(filters.endDate, "dd/MM/yyyy")
                  ) : (
                    <span>Data final</span>
                  )}
                  <Calendar className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={filters.endDate || undefined}
                  onSelect={(date) =>
                    onFilterChange({ ...filters, endDate: date })
                  }
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Engenheiro</label>
          <Select
            value={filters.engineer}
            onValueChange={(value) =>
              onFilterChange({ ...filters, engineer: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione um engenheiro" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="_all">Todos</SelectItem>
              {engineers?.map((engineer) => (
                <SelectItem key={engineer} value={engineer}>
                  {engineer}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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

        <div className="flex items-end">
          <Button
            variant="outline"
            onClick={() =>
              onFilterChange({
                startDate: null,
                endDate: null,
                engineer: "_all",
                costCenter: "_all",
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