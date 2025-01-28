import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface FiltersProps {
  filters: {
    nome: string;
    funcao: string;
    centro_custo: string;
  };
  onFilterChange: (filters: any) => void;
}

export function EmployeeFilters({ filters, onFilterChange }: FiltersProps) {
  const { data: funcoes } = useQuery({
    queryKey: ["funcoes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bd_funcao")
        .select("id, nome")
        .order("nome");

      if (error) throw error;
      return data;
    },
  });

  const { data: centrosCusto } = useQuery({
    queryKey: ["centrosCusto"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bd_centrocusto")
        .select("id, nome")
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
          <label className="text-sm font-medium">Nome</label>
          <Input
            placeholder="Digite um nome"
            value={filters.nome}
            onChange={(e) =>
              onFilterChange({ ...filters, nome: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Função</label>
          <Select
            value={filters.funcao}
            onValueChange={(value) =>
              onFilterChange({ ...filters, funcao: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma função" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="_all">Todas</SelectItem>
              {funcoes?.map((funcao) => (
                <SelectItem key={funcao.id} value={funcao.id}>
                  {funcao.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Centro de Custo</label>
          <Select
            value={filters.centro_custo}
            onValueChange={(value) =>
              onFilterChange({ ...filters, centro_custo: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione um centro de custo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="_all">Todos</SelectItem>
              {centrosCusto?.map((cc) => (
                <SelectItem key={cc.id} value={cc.id}>
                  {cc.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-end">
          <button
            className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
            onClick={() =>
              onFilterChange({
                nome: "",
                funcao: "_all",
                centro_custo: "_all",
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