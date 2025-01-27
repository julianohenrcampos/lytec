import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
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
    <TableRow>
      <TableCell>
        <Input
          {...register(`streets.${index}.logradouro`)}
          placeholder="Digite o logradouro"
        />
      </TableCell>
      <TableCell>
        <Input
          {...register(`streets.${index}.bairro`)}
          placeholder="Digite o bairro"
        />
      </TableCell>
      <TableCell>
        <Input
          type="number"
          step="0.01"
          min="0"
          {...register(`streets.${index}.largura`, {
            valueAsNumber: true,
          })}
          placeholder="0.00"
        />
      </TableCell>
      <TableCell>
        <Input
          type="number"
          step="0.01"
          min="0"
          {...register(`streets.${index}.comprimento`, {
            valueAsNumber: true,
          })}
          placeholder="0.00"
        />
      </TableCell>
      <TableCell>
        <Input
          type="number"
          value={area.toFixed(2)}
          disabled
          className="bg-muted"
        />
      </TableCell>
      <TableCell>
        <Input
          type="number"
          step="0.01"
          min="0"
          {...register(`streets.${index}.espessura`, {
            valueAsNumber: true,
          })}
          placeholder="0.00"
        />
      </TableCell>
      <TableCell>
        <Input
          type="number"
          value={peso.toFixed(2)}
          disabled
          className="bg-muted"
        />
      </TableCell>
      <TableCell className="p-2">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onRemove}
          className="h-8 w-8"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
}