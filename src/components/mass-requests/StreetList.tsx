import { useFieldArray, useFormContext } from "react-hook-form";
import { FormValues } from "./types";
import { StreetTable } from "./street-list/StreetTable";

export function StreetList() {
  const { control, watch } = useFormContext<FormValues>();
  const { fields, remove } = useFieldArray({
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
    <div className="w-full border-collapse">
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