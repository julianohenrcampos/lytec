import { Table, TableBody } from "@/components/ui/table";
import { StreetTableHeader } from "./StreetTableHeader";
import { StreetTableRow } from "./StreetTableRow";
import { StreetTableTotals } from "./StreetTableTotals";

interface StreetTableProps {
  fields: any[];
  onRemove: (index: number) => void;
  totalArea: number;
  totalWeight: number;
  totalLength: number;
}

export function StreetTable({ fields, onRemove, totalArea, totalWeight, totalLength }: StreetTableProps) {
  return (
    <div className="rounded-md border">
      <div className="overflow-x-auto">
        <Table>
          <StreetTableHeader />
          <TableBody className="text-sm">
            {fields.map((field, index) => (
              <StreetTableRow
                key={field.id}
                index={index}
                onRemove={() => onRemove(index)}
              />
            ))}
            {fields.length > 0 && (
              <StreetTableTotals
                totalArea={totalArea}
                totalWeight={totalWeight}
                totalLength={totalLength}
              />
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}