import { useFieldArray, useFormContext } from "react-hook-form";
import { FormValues } from "./types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { AddStreetButton } from "./street-list/AddStreetButton";

export function StreetList() {
  const { control, register, watch } = useFormContext<FormValues>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "streets",
  });

  const watchFieldArray = watch("streets");
  const controlledFields = fields.map((field, index) => {
    return {
      ...field,
      ...watchFieldArray[index],
    };
  });

  const handleAddStreet = () => {
    append({
      logradouro: "",
      bairro: "",
      largura: 0,
      comprimento: 0,
      espessura: 0,
    });
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Logradouro</TableHead>
              <TableHead>Bairro</TableHead>
              <TableHead className="text-right">Largura (m)</TableHead>
              <TableHead className="text-right">Comprimento (m)</TableHead>
              <TableHead className="text-right">Área (m²)</TableHead>
              <TableHead className="text-right">Espessura (m)</TableHead>
              <TableHead className="text-right">Peso (t)</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {controlledFields.map((field, index) => {
              const area = Number(field.largura) * Number(field.comprimento);
              const peso = area * Number(field.espessura) * 2.4;

              return (
                <TableRow key={field.id}>
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
                      className="text-right"
                      {...register(`streets.${index}.largura`, {
                        valueAsNumber: true,
                      })}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      className="text-right"
                      {...register(`streets.${index}.comprimento`, {
                        valueAsNumber: true,
                      })}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={area.toFixed(2)}
                      disabled
                      className="bg-muted text-right"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      className="text-right"
                      {...register(`streets.${index}.espessura`, {
                        valueAsNumber: true,
                      })}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={peso.toFixed(2)}
                      disabled
                      className="bg-muted text-right"
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(index)}
                      className="h-8 w-8"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      <AddStreetButton onClick={handleAddStreet} />
    </div>
  );
}