import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function MassRequestTableHeader() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-[40px]"></TableHead>
        <TableHead>Centro de Custo</TableHead>
        <TableHead>Diretoria</TableHead>
        <TableHead>Engenheiro</TableHead>
        <TableHead>Data</TableHead>
        <TableHead>Logradouro</TableHead>
        <TableHead>Bairro</TableHead>
        <TableHead>Área (m²)</TableHead>
        <TableHead>Peso (t)</TableHead>
        <TableHead>Traço</TableHead>
        <TableHead>Ligante</TableHead>
        <TableHead className="text-right">Ações</TableHead>
      </TableRow>
    </TableHeader>
  );
}