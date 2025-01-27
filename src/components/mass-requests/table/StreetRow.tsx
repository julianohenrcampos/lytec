import { TableCell, TableRow } from "@/components/ui/table";
import { Street } from "../types";

interface StreetRowProps {
  street: Street;
}

export function StreetRow({ street }: StreetRowProps) {
  return (
    <TableRow className="bg-muted/50">
      <TableCell></TableCell>
      <TableCell colSpan={4}></TableCell>
      <TableCell>{street.logradouro}</TableCell>
      <TableCell>{street.bairro || "-"}</TableCell>
      <TableCell className="text-center">{street.area?.toFixed(2)}</TableCell>
      <TableCell className="text-center">{street.peso?.toFixed(2)}</TableCell>
      <TableCell>{street.traco || "-"}</TableCell>
      <TableCell>{street.ligante || "-"}</TableCell>
      <TableCell></TableCell>
    </TableRow>
  );
}