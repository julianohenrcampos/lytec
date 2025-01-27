import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function StreetTableHeader() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-[30%]">Logradouro</TableHead>
        <TableHead className="w-[30%]">Bairro</TableHead>
        <TableHead className="w-[6%] text-center">Largura (m)</TableHead>
        <TableHead className="w-[6%] text-center">Comprimento (m)</TableHead>
        <TableHead className="w-[7%] text-center">Área (m²)</TableHead>
        <TableHead className="w-[6%] text-center">Espessura (m)</TableHead>
        <TableHead className="w-[7%] text-center">Peso (t)</TableHead>
        <TableHead className="w-[50px]"></TableHead>
      </TableRow>
    </TableHeader>
  );
}