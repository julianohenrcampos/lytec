import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";

export default function MassRequestDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: request, isLoading } = useQuery({
    queryKey: ["mass-request", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bd_requisicao")
        .select(`
          *,
          bd_ruas_requisicao (*)
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  if (!request) {
    return <div>Requisição não encontrada</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <Button
        variant="outline"
        onClick={() => navigate("/mass-requests")}
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Voltar
      </Button>

      <Card className="p-6 mb-8">
        <div className="grid grid-cols-5 gap-6">
          <div>
            <h3 className="font-semibold text-sm text-gray-500 mb-1">Data</h3>
            <p className="text-base">{format(new Date(request.data), "dd/MM/yyyy")}</p>
          </div>
          <div>
            <h3 className="font-semibold text-sm text-gray-500 mb-1">Centro de Custo</h3>
            <p className="text-base">{request.centro_custo}</p>
          </div>
          <div>
            <h3 className="font-semibold text-sm text-gray-500 mb-1">Diretoria</h3>
            <p className="text-base">{request.diretoria || "-"}</p>
          </div>
          <div>
            <h3 className="font-semibold text-sm text-gray-500 mb-1">Gerência</h3>
            <p className="text-base">{request.gerencia || "-"}</p>
          </div>
          <div>
            <h3 className="font-semibold text-sm text-gray-500 mb-1">Engenheiro</h3>
            <p className="text-base">{request.engenheiro}</p>
          </div>
        </div>
      </Card>

      <Card className="p-6 mb-8">
        <div className="grid grid-cols-3 gap-6">
          <div>
            <h3 className="font-semibold text-sm text-gray-500 mb-1">Área Total</h3>
            <p className="text-base">{request.area} m²</p>
          </div>
          <div>
            <h3 className="font-semibold text-sm text-gray-500 mb-1">Peso Total</h3>
            <p className="text-base">{request.peso} t</p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
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
            {request.bd_ruas_requisicao?.map((street: any) => (
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
      </Card>
    </div>
  );
}