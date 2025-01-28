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
      traco: "",
      ligante: "",
    });
  };

  const totalArea = controlledFields.reduce((sum, field) => {
    return sum + (Number(field.largura) * Number(field.comprimento));
  }, 0);

  const totalWeight = controlledFields.reduce((sum, field) => {
    return sum + (Number(field.largura) * Number(field.comprimento) * Number(field.espessura) * 2.4);
  }, 0);

  const totalLength = controlledFields.reduce((sum, field) => {
    return sum + Number(field.comprimento);
  }, 0);

  return (
    <div className="w-full border-collapse border">
      <StreetTable
        fields={controlledFields}
        onRemove={remove}
        totalArea={totalArea}
        totalWeight={totalWeight}
        totalLength={totalLength}
      />
    </div>
  );
}