import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";
import { FormValues } from "../types";

interface StreetTableRowProps {
  index: number;
  onRemove: (index: number) => void;
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
          type="text"
          {...register(`streets.${index}.logradouro`, {
            required: true,
          })}
          className="w-full"
        />
      </td>
      <td>
        <Input
          type="text"
          {...register(`streets.${index}.bairro`)}
          className="w-full"
        />
      </td>
      <td className="w-[8%]">
        <Input
          type="number"
          step="0.01"
          {...register(`streets.${index}.largura`, {
            required: true,
            valueAsNumber: true,
          })}
          className="text-center w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
      </td>
      <td className="w-[8%]">
        <Input
          type="number"
          step="0.01"
          {...register(`streets.${index}.comprimento`, {
            required: true,
            valueAsNumber: true,
          })}
          className="text-center w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
      </td>
      <td className="w-[10%]">
        <Input
          type="number"
          value={area.toFixed(2)}
          readOnly
          className="bg-muted text-center w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
      </td>
      <td className="w-[8%]">
        <Input
          type="number"
          step="0.01"
          {...register(`streets.${index}.espessura`, {
            required: true,
            valueAsNumber: true,
          })}
          className="text-center w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
      </td>
      <td className="w-[10%]">
        <Input
          type="number"
          value={peso.toFixed(2)}
          readOnly
          className="bg-muted text-center w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
      </td>
      <td>
        <Input
          type="text"
          {...register(`streets.${index}.traco`)}
          className="w-full"
          placeholder="Traço"
        />
      </td>
      <td>
        <Input
          type="text"
          {...register(`streets.${index}.ligante`)}
          className="w-full"
          placeholder="Ligante"
        />
      </td>
      <td>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onRemove(index)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </td>
    </tr>
  );
}