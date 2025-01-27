import { Card, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { UseFormRegister } from "react-hook-form";
import { FormValues } from "../types";

interface StreetTableHeaderProps {
  index: number;
  register: UseFormRegister<FormValues>;
}

export function StreetTableHeader({ index, register }: StreetTableHeaderProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-medium">Logradouro:</span>
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  {...register(`streets.${index}.logradouro`)}
                  placeholder="Digite o logradouro"
                />
              </div>
              <div className="flex-1">
                <Input
                  {...register(`streets.${index}.bairro`)}
                  placeholder="Digite o bairro"
                />
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
}