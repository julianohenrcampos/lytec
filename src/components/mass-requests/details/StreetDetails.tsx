import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Street {
  id: string;
  logradouro: string;
  bairro?: string;
  largura: number;
  comprimento: number;
  area?: number;
  ligante?: string;
  traco?: string;
  espessura: number;
  peso?: number;
}

interface StreetDetailsProps {
  streets: Street[];
  totalArea?: number;
  totalWeight?: number;
}

export function StreetDetails({ streets, totalArea, totalWeight }: StreetDetailsProps) {
  return (
    <div>
      <h2 className="font-semibold text-lg mb-4">Lista de Ruas</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Logradouro</TableHead>
            <TableHead>Bairro</TableHead>
            <TableHead className="text-center">Largura (m)</TableHead>
            <TableHead className="text-center">Comprimento (m)</TableHead>
            <TableHead className="text-center">Área (m²)</TableHead>
            <TableHead className="text-center">Pintura de Ligação</TableHead>
            <TableHead className="text-center">Traço</TableHead>
            <TableHead className="text-center">Espessura (m)</TableHead>
            <TableHead className="text-center">Volume (t)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {streets.map((street) => (
            <TableRow key={street.id}>
              <TableCell>{street.logradouro}</TableCell>
              <TableCell>{street.bairro || "-"}</TableCell>
              <TableCell className="text-center">{street.largura}</TableCell>
              <TableCell className="text-center">{street.comprimento}</TableCell>
              <TableCell className="text-center">{street.area}</TableCell>
              <TableCell className="text-center">{street.ligante || "-"}</TableCell>
              <TableCell className="text-center">{street.traco || "-"}</TableCell>
              <TableCell className="text-center">{street.espessura}</TableCell>
              <TableCell className="text-center">{street.peso}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="mt-6 border-t pt-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col">
            <h3 className="font-semibold text-sm text-gray-500 mb-1">Área Total</h3>
            <p className="text-base">{totalArea} m²</p>
          </div>
          <div className="flex flex-col">
            <h3 className="font-semibold text-sm text-gray-500 mb-1">Peso Total</h3>
            <p className="text-base">{totalWeight} t</p>
          </div>
        </div>
      </div>
    </div>
  );
}