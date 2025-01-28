import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const EmployeeTableHeader = () => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Imagem</TableHead>
        <TableHead>Nome</TableHead>
        <TableHead>Função</TableHead>
        <TableHead>Empresa Proprietária</TableHead>
        <TableHead>Centro de Custo</TableHead>
        <TableHead>Data de Admissão</TableHead>
        <TableHead className="text-right">Ações</TableHead>
      </TableRow>
    </TableHeader>
  );
};