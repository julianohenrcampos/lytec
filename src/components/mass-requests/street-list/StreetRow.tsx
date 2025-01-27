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
          {/* Dimensions Section */}
          <div className="space-y-2">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[120px]">
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  {...register(`streets.${index}.largura`, {
                    valueAsNumber: true,
                  })}
                  placeholder="Largura (m)"
                />
              </div>
              <div className="flex-1 min-w-[120px]">
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  {...register(`streets.${index}.comprimento`, {
                    valueAsNumber: true,
                  })}
                  placeholder="Comprimento (m)"
                />
              </div>
              <div className="flex-1 min-w-[120px]">
                <Input
                  type="number"
                  value={area.toFixed(2)}
                  disabled
                  className="bg-muted"
                  placeholder="Área (m²)"
                />
              </div>
              <div className="flex-1 min-w-[120px]">
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  {...register(`streets.${index}.espessura`, {
                    valueAsNumber: true,
                  })}
                  placeholder="Espessura (m)"
                />
              </div>
              <div className="flex-1 min-w-[120px]">
                <Input
                  type="number"
                  value={peso.toFixed(2)}
                  disabled
                  className="bg-muted"
                  placeholder="Peso (t)"
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