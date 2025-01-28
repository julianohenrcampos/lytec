import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function StreetTableHeader() {
  return (
    <TableHeader>
      <TableRow className="border-b bg-muted/50 hover:bg-muted/50">
        <TableHead className="h-8 px-2 text-center whitespace-nowrap font-medium">Data</TableHead>
        <TableHead className="h-8 px-2 whitespace-nowrap font-medium">Logradouro</TableHead>
        <TableHead className="h-8 px-2 whitespace-nowrap font-medium">Bairro</TableHead>
        <TableHead className="h-8 px-2 text-center whitespace-nowrap font-medium">Largura (m)</TableHead>
        <TableHead className="h-8 px-2 text-center whitespace-nowrap font-medium">Comprimento (m)</TableHead>
        <TableHead className="h-8 px-2 text-center whitespace-nowrap font-medium">Área (m²)</TableHead>
        <TableHead className="h-8 px-2 text-center whitespace-nowrap font-medium">Pintura de Ligação</TableHead>
        <TableHead className="h-8 px-2 text-center whitespace-nowrap font-medium">Traço</TableHead>
        <TableHead className="h-8 px-2 text-center whitespace-nowrap font-medium">Espessura (m)</TableHead>
        <TableHead className="h-8 px-2 text-center whitespace-nowrap font-medium">Volume (t)</TableHead>
        <TableHead className="h-8 w-8 px-2"></TableHead>
      </TableRow>
    </TableHeader>
  );
}