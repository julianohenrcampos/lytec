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
        <TableHead>Diretoria</TableHead>
        <TableHead>Gerência</TableHead>
        <TableHead>Engenheiro</TableHead>
        <TableHead>Logradouro</TableHead>
        <TableHead>Bairro</TableHead>
        <TableHead>Área (m²)</TableHead>
        <TableHead>Volume (t)</TableHead>
        <TableHead>Qtd. Programada</TableHead>
        <TableHead>Traço</TableHead>
        <TableHead>Ligante</TableHead>
        <TableHead className="text-right">Ações</TableHead>
      </TableRow>
    </TableHeader>
  );
}