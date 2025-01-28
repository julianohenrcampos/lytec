import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function StreetTableHeader() {
  return (
    <TableHeader>
      <TableRow className="bg-gray-200">
        <TableHead className="border p-2 text-center font-medium">DATA</TableHead>
        <TableHead className="border p-2 font-medium">LOGRADOURO</TableHead>
        <TableHead className="border p-2 font-medium">BAIRRO</TableHead>
        <TableHead className="border p-2 text-center font-medium">LARGURA (m)</TableHead>
        <TableHead className="border p-2 text-center font-medium">COMPRIMENTO (m)</TableHead>
        <TableHead className="border p-2 text-center font-medium">ÁREA (m²)</TableHead>
        <TableHead className="border p-2 text-center font-medium">PINTURA DE LIGAÇÃO</TableHead>
        <TableHead className="border p-2 text-center font-medium">TRAÇO</TableHead>
        <TableHead className="border p-2 text-center font-medium">ESPESSURA (m)</TableHead>
        <TableHead className="border p-2 text-center font-medium">VOLUME (t)</TableHead>
        <TableHead className="border p-2 w-8"></TableHead>
      </TableRow>
    </TableHeader>
  );
}