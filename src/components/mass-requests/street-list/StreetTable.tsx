import { Table, TableBody } from "@/components/ui/table";
import { StreetTableHeader } from "./StreetTableHeader";
import { StreetTableRow } from "./StreetTableRow";
import { StreetTableTotals } from "./StreetTableTotals";

interface StreetTableProps {
  fields: any[];
  onRemove: (index: number) => void;
  totalArea: number;
  totalWeight: number;
}

export function StreetTable({ fields, onRemove, totalArea, totalWeight }: StreetTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <StreetTableHeader />
        <TableBody>
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
            />
          )}
        </TableBody>
      </Table>
    </div>
  );
}