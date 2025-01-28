import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function StreetTableHeader() {
  return (
    <TableHeader>
      <TableRow className="bg-muted/50">
        <TableHead className="w-[8%] text-center font-medium">Data</TableHead>
        <TableHead className="w-[18%] font-medium">Logradouro</TableHead>
        <TableHead className="w-[12%] font-medium">Bairro</TableHead>
        <TableHead className="w-[8%] text-center font-medium">Largura (m)</TableHead>
        <TableHead className="w-[10%] text-center font-medium">Comprimento (m)</TableHead>
        <TableHead className="w-[8%] text-center font-medium">Área (m²)</TableHead>
        <TableHead className="w-[10%] text-center font-medium">Pintura de Ligação</TableHead>
        <TableHead className="w-[8%] text-center font-medium">Traço</TableHead>
        <TableHead className="w-[8%] text-center font-medium">Espessura (m)</TableHead>
        <TableHead className="w-[8%] text-center font-medium">Volume (t)</TableHead>
        <TableHead className="w-[2%]"></TableHead>
      </TableRow>
    </TableHeader>
  );
}