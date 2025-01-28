import { TableCell, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";

interface StreetTableTotalsProps {
  totalArea: number;
  totalWeight: number;
  totalLength: number;
}

export function StreetTableTotals({ totalArea, totalWeight, totalLength }: StreetTableTotalsProps) {
  return (
    <TableRow className="border-t bg-muted/50 font-medium hover:bg-muted/50">
      <TableCell className="h-8 px-2">Total</TableCell>
      <TableCell className="h-8 px-2">-</TableCell>
      <TableCell className="h-8 px-2">-</TableCell>
      <TableCell className="h-8 px-2">-</TableCell>
      <TableCell className="h-8 px-2">
        <Input
          type="number"
          value={totalLength.toFixed(2)}
          readOnly
          className="h-7 text-center bg-transparent border-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
      </TableCell>
      <TableCell className="h-8 px-2">
        <Input
          type="number"
          value={totalArea.toFixed(2)}
          readOnly
          className="h-7 text-center bg-transparent border-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
      </TableCell>
      <TableCell className="h-8 px-2">-</TableCell>
      <TableCell className="h-8 px-2">-</TableCell>
      <TableCell className="h-8 px-2">-</TableCell>
      <TableCell className="h-8 px-2">
        <Input
          type="number"
          value={totalWeight.toFixed(2)}
          readOnly
          className="h-7 text-center bg-transparent border-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
      </TableCell>
      <TableCell className="h-8 w-8 px-2" />
    </TableRow>
  );
}