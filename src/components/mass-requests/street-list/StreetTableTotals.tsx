import { TableCell, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";

interface StreetTableTotalsProps {
  totalArea: number;
  totalWeight: number;
  totalLength: number;
}

export function StreetTableTotals({ totalArea, totalWeight, totalLength }: StreetTableTotalsProps) {
  return (
    <TableRow className="bg-muted/50 font-medium">
      <TableCell>Total</TableCell>
      <TableCell>-</TableCell>
      <TableCell>-</TableCell>
      <TableCell>-</TableCell>
      <TableCell>
        <Input
          type="number"
          value={totalLength.toFixed(2)}
          readOnly
          className="bg-muted text-center w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
      </TableCell>
      <TableCell>
        <Input
          type="number"
          value={totalArea.toFixed(2)}
          readOnly
          className="bg-muted text-center w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
      </TableCell>
      <TableCell>-</TableCell>
      <TableCell>-</TableCell>
      <TableCell>-</TableCell>
      <TableCell>
        <Input
          type="number"
          value={totalWeight.toFixed(2)}
          readOnly
          className="bg-muted text-center w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
      </TableCell>
      <TableCell />
    </TableRow>
  );
}