import {
  TableHeader,
  TableRow,
  TableHead,
} from "@/components/ui/table";

export function MassRequestTableHeader() {
  return (
    <TableHeader className="bg-gray-100">
      <TableRow>
        <TableHead className="w-[100px]">DATA</TableHead>
        <TableHead>LOGRADOURO</TableHead>
        <TableHead>BAIRRO</TableHead>
        <TableHead className="text-center">LARGURA (m)</TableHead>
        <TableHead className="text-center">COMPRIMENTO (m)</TableHead>
        <TableHead className="text-center">ÁREA (m²)</TableHead>
        <TableHead className="text-center">PINTURA DE LIGAÇÃO</TableHead>
        <TableHead className="text-center">TRAÇO</TableHead>
        <TableHead className="text-center">ESPESSURA (m)</TableHead>
        <TableHead className="text-center">VOLUME (t)</TableHead>
        <TableHead className="text-right">Ações</TableHead>
      </TableRow>
    </TableHeader>
  );
}