import { Table, TableBody } from "@/components/ui/table";
import { useFieldArray, useFormContext } from "react-hook-form";
import { FormValues } from "./types";
import { StreetRow } from "./street-list/StreetRow";
import { StreetTableHeader } from "./street-list/StreetTableHeader";
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
          <StreetTableHeader />
          <TableBody>
            {controlledFields.map((field, index) => {
              const area = Number(field.largura) * Number(field.comprimento);
              const peso = area * Number(field.espessura) * 2.4;

              return (
                <StreetRow
                  key={field.id}
                  index={index}
                  register={register}
                  onRemove={() => remove(index)}
                  area={area}
                  peso={peso}
                />
              );
            })}
          </TableBody>
        </Table>
      </div>
      <AddStreetButton onClick={handleAddStreet} />
    </div>
  );
}