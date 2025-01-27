import { useFieldArray, useFormContext } from "react-hook-form";
import { FormValues } from "./types";
import { Button } from "@/components/ui/button";
import { Eye, X } from "lucide-react";
import { AddStreetButton } from "./street-list/AddStreetButton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { StreetTable } from "./street-list/StreetTable";

export function StreetList() {
  const { control, watch } = useFormContext<FormValues>();
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

  const totalArea = controlledFields.reduce((sum, field) => {
    return sum + (Number(field.largura) * Number(field.comprimento));
  }, 0);

  const totalWeight = controlledFields.reduce((sum, field) => {
    return sum + (Number(field.largura) * Number(field.comprimento) * Number(field.espessura) * 2.4);
  }, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          {controlledFields.length} rua(s) adicionada(s)
        </span>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon">
              <Eye className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-7xl">
            <DialogHeader className="flex flex-row items-center justify-between border-b pb-2">
              <DialogTitle>Lista de Ruas</DialogTitle>
              <div className="flex items-center gap-2">
                <AddStreetButton onClick={handleAddStreet} />
                <DialogClose asChild>
                  <Button variant="outline" size="icon">
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                  </Button>
                </DialogClose>
              </div>
            </DialogHeader>
            <StreetTable
              fields={controlledFields}
              onRemove={remove}
              totalArea={totalArea}
              totalWeight={totalWeight}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}