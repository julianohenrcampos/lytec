import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";

interface ChecklistFiltersProps {
  operatorFilter: string;
  setOperatorFilter: (value: string) => void;
  dateFilter: Date | undefined;
  setDateFilter: (date: Date | undefined) => void;
  equipmentFilter: string;
  setEquipmentFilter: (value: string) => void;
}

export function ChecklistFilters({
  operatorFilter,
  setOperatorFilter,
  dateFilter,
  setDateFilter,
  equipmentFilter,
  setEquipmentFilter,
}: ChecklistFiltersProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="space-y-2">
        <Label htmlFor="operator">Operador</Label>
        <Input
          id="operator"
          placeholder="Filtrar por operador"
          value={operatorFilter}
          onChange={(e) => setOperatorFilter(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label>Data</Label>
        <DatePicker
          date={dateFilter}
          onDateChange={setDateFilter}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="equipment">Caminhão/Equipamento</Label>
        <Input
          id="equipment"
          placeholder="Filtrar por caminhão/equipamento"
          value={equipmentFilter}
          onChange={(e) => setEquipmentFilter(e.target.value)}
        />
      </div>
    </div>
  );
}