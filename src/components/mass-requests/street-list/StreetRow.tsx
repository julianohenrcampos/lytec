import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import { UseFormRegister } from "react-hook-form";
import { FormValues } from "../types";

interface StreetRowProps {
  index: number;
  register: UseFormRegister<FormValues>;
  onRemove: () => void;
  area: number;
  peso: number;
}

export function StreetRow({ index, register, onRemove, area, peso }: StreetRowProps) {
  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="font-medium mb-2">Dimensões:</div>
          <div className="space-y-2">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[120px]">
                <div className="text-sm text-gray-600 mb-1">Largura (m)</div>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  {...register(`streets.${index}.largura`, {
                    valueAsNumber: true,
                  })}
                />
              </div>
              <div className="flex-1 min-w-[120px]">
                <div className="text-sm text-gray-600 mb-1">Comprimento (m)</div>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  {...register(`streets.${index}.comprimento`, {
                    valueAsNumber: true,
                  })}
                />
              </div>
              <div className="flex-1 min-w-[120px]">
                <div className="text-sm text-gray-600 mb-1">Área (m²)</div>
                <Input
                  type="number"
                  value={area.toFixed(2)}
                  disabled
                  className="bg-muted"
                />
              </div>
              <div className="flex-1 min-w-[120px]">
                <div className="text-sm text-gray-600 mb-1">Espessura (m)</div>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  {...register(`streets.${index}.espessura`, {
                    valueAsNumber: true,
                  })}
                />
              </div>
              <div className="flex-1 min-w-[120px]">
                <div className="text-sm text-gray-600 mb-1">Peso (t)</div>
                <Input
                  type="number"
                  value={peso.toFixed(2)}
                  disabled
                  className="bg-muted"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Delete Button */}
        <div className="absolute top-4 right-4">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onRemove}
            className="h-8 w-8"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}