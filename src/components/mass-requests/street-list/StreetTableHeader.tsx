import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function StreetTableHeader() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-[10%] text-center">Data</TableHead>
        <TableHead className="w-[20%]">Logradouro</TableHead>
        <TableHead className="w-[15%]">Bairro</TableHead>
        <TableHead className="w-[10%] text-center">Largura (m)</TableHead>
        <TableHead className="w-[10%] text-center">Comprimento (m)</TableHead>
        <TableHead className="w-[10%] text-center">Área (m²)</TableHead>
        <TableHead className="w-[10%] text-center">Pintura de Ligação</TableHead>
        <TableHead className="w-[10%] text-center">Traço</TableHead>
        <TableHead className="w-[10%] text-center">Espessura (m)</TableHead>
        <TableHead className="w-[10%] text-center">Volume (t)</TableHead>
        <TableHead className="w-[50px]"></TableHead>
      </TableRow>
    </TableHeader>
  );
}