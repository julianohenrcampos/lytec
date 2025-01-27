import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function StreetTableHeader() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-[30%]">Logradouro</TableHead>
        <TableHead className="w-[30%]">Bairro</TableHead>
        <TableHead className="w-[6%] text-right">Largura (m)</TableHead>
        <TableHead className="w-[6%] text-right">Comprimento (m)</TableHead>
        <TableHead className="w-[7%] text-right">Área (m²)</TableHead>
        <TableHead className="w-[6%] text-right">Espessura (m)</TableHead>
        <TableHead className="w-[7%] text-right">Peso (t)</TableHead>
        <TableHead className="w-[50px]"></TableHead>
      </TableRow>
    </TableHeader>
  );
}