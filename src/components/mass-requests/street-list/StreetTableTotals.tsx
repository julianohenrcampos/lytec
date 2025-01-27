import { TableCell, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";

interface StreetTableTotalsProps {
  totalArea: number;
  totalWeight: number;
  totalLength: number;
}

export function StreetTableTotals({ totalArea, totalWeight, totalLength }: StreetTableTotalsProps) {
  return (
    <TableRow className="bg-muted/50 font-medium border-t">
      <TableCell className="p-0">Total</TableCell>
      <TableCell className="p-0">-</TableCell>
      <TableCell className="p-0">-</TableCell>
      <TableCell className="p-0">-</TableCell>
      <TableCell className="p-0">
        <Input
          type="number"
          value={totalLength.toFixed(2)}
          readOnly
          className="bg-transparent text-center border-0 h-8 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
      </TableCell>
      <TableCell className="p-0">
        <Input
          type="number"
          value={totalArea.toFixed(2)}
          readOnly
          className="bg-transparent text-center border-0 h-8 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
      </TableCell>
      <TableCell className="p-0">-</TableCell>
      <TableCell className="p-0">-</TableCell>
      <TableCell className="p-0">-</TableCell>
      <TableCell className="p-0">
        <Input
          type="number"
          value={totalWeight.toFixed(2)}
          readOnly
          className="bg-transparent text-center border-0 h-8 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
      </TableCell>
      <TableCell className="p-0" />
    </TableRow>
  );
}