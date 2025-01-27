import { TableCell, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";

interface StreetTableTotalsProps {
  totalArea: number;
  totalWeight: number;
}

export function StreetTableTotals({ totalArea, totalWeight }: StreetTableTotalsProps) {
  return (
    <TableRow>
      <TableCell colSpan={4} className="text-right font-medium">
        Total:
      </TableCell>
      <TableCell className="text-right">
        <Input
          type="number"
          value={totalArea.toFixed(2)}
          disabled
          className="bg-muted text-right font-medium w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
      </TableCell>
      <TableCell />
      <TableCell className="text-right">
        <Input
          type="number"
          value={totalWeight.toFixed(2)}
          disabled
          className="bg-muted text-right font-medium w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
      </TableCell>
      <TableCell />
    </TableRow>
  );
}