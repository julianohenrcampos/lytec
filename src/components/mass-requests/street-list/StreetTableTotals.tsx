import { TableCell, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";

interface StreetTableTotalsProps {
  totalArea: number;
  totalWeight: number;
  totalLength: number;
}

export function StreetTableTotals({ totalArea, totalWeight, totalLength }: StreetTableTotalsProps) {
  return (
    <TableRow className="bg-gray-100 font-medium">
      <TableCell className="border p-2">Total</TableCell>
      <TableCell className="border p-2">-</TableCell>
      <TableCell className="border p-2">-</TableCell>
      <TableCell className="border p-2">-</TableCell>
      <TableCell className="border p-2">
        <Input
          type="number"
          value={totalLength.toFixed(2)}
          readOnly
          className="bg-transparent border-0 p-0 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
      </TableCell>
      <TableCell className="border p-2">
        <Input
          type="number"
          value={totalArea.toFixed(2)}
          readOnly
          className="bg-transparent border-0 p-0 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
      </TableCell>
      <TableCell className="border p-2">-</TableCell>
      <TableCell className="border p-2">-</TableCell>
      <TableCell className="border p-2">-</TableCell>
      <TableCell className="border p-2">
        <Input
          type="number"
          value={totalWeight.toFixed(2)}
          readOnly
          className="bg-transparent border-0 p-0 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
      </TableCell>
      <TableCell className="border p-2 w-8" />
    </TableRow>
  );
}