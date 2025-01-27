import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function StreetTableHeader() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-[20%]">Logradouro</TableHead>
        <TableHead className="w-[20%]">Bairro</TableHead>
        <TableHead className="w-[6%] text-center">Largura (m)</TableHead>
        <TableHead className="w-[6%] text-center">Comprimento (m)</TableHead>
        <TableHead className="w-[7%] text-center">Área (m²)</TableHead>
        <TableHead className="w-[6%] text-center">Espessura (m)</TableHead>
        <TableHead className="w-[7%] text-center">Peso (t)</TableHead>
        <TableHead className="w-[10%]">Traço</TableHead>
        <TableHead className="w-[10%]">Ligante</TableHead>
        <TableHead className="w-[50px]"></TableHead>
      </TableRow>
    </TableHeader>
  );
}