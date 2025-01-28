import { Filter } from "lucide-react";
import { Input } from "@/components/ui/input";

interface TeamFiltersProps {
  filters: {
    teamName: string;
  };
  onFilterChange: (filters: any) => void;
}

export function TeamFilters({ filters, onFilterChange }: TeamFiltersProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <div className="flex justify-end items-center gap-2 mb-4">
        <Filter className="h-4 w-4" />
        <h2 className="text-sm font-medium">Filtros</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Nome da Equipe</label>
          <Input
            value={filters.teamName}
            onChange={(e) =>
              onFilterChange({ ...filters, teamName: e.target.value })
            }
            placeholder="Digite o nome da equipe"
          />
        </div>

        <div className="flex items-end">
          <button
            className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            onClick={() =>
              onFilterChange({
                teamName: "",
              })
            }
          >
            Limpar Filtros
          </button>
        </div>
      </div>
    </div>
  );
}