import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";
import { FormValues } from "../types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { TableCell, TableRow } from "@/components/ui/table";

interface StreetTableRowProps {
  index: number;
  onRemove: (index: number) => void;
}

export function StreetTableRow({ index, onRemove }: StreetTableRowProps) {
  const { register, control } = useFormContext<FormValues>();
  const values = useWatch({
    name: [
      `streets.${index}.largura`,
      `streets.${index}.comprimento`,
      `streets.${index}.espessura`
    ],
    control
  });

  const data = useWatch({
    name: "data",
    control
  });

  const [largura, comprimento, espessura] = values;
  const area = Number(largura || 0) * Number(comprimento || 0);
  const volume = area * Number(espessura || 0) * 2.4;

  return (
    <TableRow className="hover:bg-muted/50">
      <TableCell className="text-center p-0">
        <Input
          type="text"
          value={data ? format(data, "dd/MM/yyyy") : ""}
          readOnly
          className="text-center bg-muted border-0 h-8"
        />
      </TableCell>
      <TableCell className="p-0">
        <Input
          type="text"
          {...register(`streets.${index}.logradouro`, {
            required: true,
          })}
          className="w-full border-0 h-8"
        />
      </TableCell>
      <TableCell className="p-0">
        <Input
          type="text"
          {...register(`streets.${index}.bairro`)}
          className="w-full border-0 h-8"
        />
      </TableCell>
      <TableCell className="p-0">
        <Input
          type="number"
          step="0.01"
          {...register(`streets.${index}.largura`, {
            required: true,
            valueAsNumber: true,
          })}
          className="text-center border-0 h-8 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
      </TableCell>
      <TableCell className="p-0">
        <Input
          type="number"
          step="0.01"
          {...register(`streets.${index}.comprimento`, {
            required: true,
            valueAsNumber: true,
          })}
          className="text-center border-0 h-8 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
      </TableCell>
      <TableCell className="p-0">
        <Input
          type="number"
          value={area.toFixed(2)}
          readOnly
          className="bg-muted text-center border-0 h-8 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
      </TableCell>
      <TableCell className="p-0">
        <Select
          {...register(`streets.${index}.ligante`)}
          defaultValue=""
        >
          <SelectTrigger className="border-0 h-8">
            <SelectValue placeholder="Ligante" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="IMPRIMA">IMPRIMA</SelectItem>
            <SelectItem value="RR">RR</SelectItem>
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell className="p-0">
        <Select
          {...register(`streets.${index}.traco`)}
          defaultValue=""
        >
          <SelectTrigger className="border-0 h-8">
            <SelectValue placeholder="Traço" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Binder">Binder</SelectItem>
            <SelectItem value="5A">5A</SelectItem>
            <SelectItem value="4C">4C</SelectItem>
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell className="p-0">
        <Input
          type="number"
          step="0.01"
          {...register(`streets.${index}.espessura`, {
            required: true,
            valueAsNumber: true,
          })}
          className="text-center border-0 h-8 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
      </TableCell>
      <TableCell className="p-0">
        <Input
          type="number"
          value={volume.toFixed(2)}
          readOnly
          className="bg-muted text-center border-0 h-8 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
      </TableCell>
      <TableCell className="p-0">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onRemove(index)}
          className="h-8 w-8"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
}