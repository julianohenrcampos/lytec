import {
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function MassRequestTableHeader() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Data</TableHead>
        <TableHead>Centro de Custo</TableHead>
        <TableHead>Engenheiro</TableHead>
        <TableHead>Área (m²)</TableHead>
        <TableHead>Volume (t)</TableHead>
        <TableHead>Qtd. Programada</TableHead>
        <TableHead className="text-right">Ações</TableHead>
      </TableRow>
    </TableHeader>
  );
}