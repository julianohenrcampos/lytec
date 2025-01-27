import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";
import { FormValues } from "../types";

interface StreetTableRowProps {
  index: number;
  onRemove: () => void;
}

export function StreetTableRow({ index, onRemove }: StreetTableRowProps) {
  const { register } = useFormContext<FormValues>();
  const values = useWatch({
    name: [
      `streets.${index}.largura`,
      `streets.${index}.comprimento`,
      `streets.${index}.espessura`
    ]
  });

  const [largura, comprimento, espessura] = values;
  const area = Number(largura || 0) * Number(comprimento || 0);
  const peso = area * Number(espessura || 0) * 2.4;

  return (
    <tr>
      <td>
        <Input
          {...register(`streets.${index}.logradouro`)}
          placeholder="Digite o logradouro"
          className="w-full"
        />
      </td>
      <td>
        <Input
          {...register(`streets.${index}.bairro`)}
          placeholder="Digite o bairro"
          className="w-full"
        />
      </td>
      <td className="w-[8%]">
        <Input
          type="number"
          step="0.01"
          min="0"
          className="text-right w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          {...register(`streets.${index}.largura`, {
            valueAsNumber: true,
          })}
        />
      </td>
      <td className="w-[8%]">
        <Input
          type="number"
          step="0.01"
          min="0"
          className="text-right w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          {...register(`streets.${index}.comprimento`, {
            valueAsNumber: true,
          })}
        />
      </td>
      <td className="w-[10%]">
        <Input
          type="number"
          value={area.toFixed(2)}
          disabled
          className="bg-muted text-right w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
      </td>
      <td className="w-[8%]">
        <Input
          type="number"
          step="0.01"
          min="0"
          className="text-right w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          {...register(`streets.${index}.espessura`, {
            valueAsNumber: true,
          })}
        />
      </td>
      <td className="w-[10%]">
        <Input
          type="number"
          value={peso.toFixed(2)}
          disabled
          className="bg-muted text-right w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
      </td>
      <td>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onRemove}
          className="h-8 w-8"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </td>
    </tr>
  );
}