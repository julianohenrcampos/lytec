import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function MassRequestTableHeader() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-[40px]">Expandir</TableHead>
        <TableHead>Centro de Custo</TableHead>
        <TableHead>Diretoria</TableHead>
        <TableHead>Engenheiro Responsável</TableHead>
        <TableHead>Data da Requisição</TableHead>
        <TableHead>Endereço</TableHead>
        <TableHead>Bairro</TableHead>
        <TableHead className="text-right">Área Total (m²)</TableHead>
        <TableHead className="text-right">Peso Total (t)</TableHead>
        <TableHead>Tipo de Traço</TableHead>
        <TableHead>Tipo de Ligante</TableHead>
        <TableHead className="text-right">Ações</TableHead>
      </TableRow>
    </TableHeader>
  );
}