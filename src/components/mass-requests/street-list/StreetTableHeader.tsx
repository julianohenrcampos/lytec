import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function StreetTableHeader() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Logradouro</TableHead>
        <TableHead>Bairro</TableHead>
        <TableHead>Largura (m)</TableHead>
        <TableHead>Comprimento (m)</TableHead>
        <TableHead>Área (m²)</TableHead>
        <TableHead>Espessura (m)</TableHead>
        <TableHead>Peso (t)</TableHead>
        <TableHead className="w-[50px]"></TableHead>
      </TableRow>
    </TableHeader>
  );
}