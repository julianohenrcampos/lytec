import {
  TableHeader,
  TableRow,
  TableHead,
} from "@/components/ui/table";

export function MassRequestTableHeader() {
  return (
    <TableHeader className="bg-gray-100">
      <TableRow>
        <TableHead>DATA</TableHead>
        <TableHead>CENTRO DE CUSTO</TableHead>
        <TableHead>DIRETORIA</TableHead>
        <TableHead>GERÊNCIA</TableHead>
        <TableHead>ENGENHEIRO</TableHead>
        <TableHead className="text-right">AÇÕES</TableHead>
      </TableRow>
    </TableHeader>
  );
}