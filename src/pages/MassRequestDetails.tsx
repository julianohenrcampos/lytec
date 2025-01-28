import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => navigate("/mass-requests")}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <h1 className="text-2xl font-bold">Detalhes da Requisição</h1>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <h2 className="font-semibold mb-2">Informações Gerais</h2>
          <div className="space-y-2">
            <p><span className="font-medium">Data:</span> {format(new Date(request.data), "dd/MM/yyyy")}</p>
            <p><span className="font-medium">Centro de Custo:</span> {request.centro_custo}</p>
            <p><span className="font-medium">Diretoria:</span> {request.diretoria || "-"}</p>
            <p><span className="font-medium">Gerência:</span> {request.gerencia || "-"}</p>
            <p><span className="font-medium">Engenheiro:</span> {request.engenheiro}</p>
          </div>
        </div>
        <div>
          <h2 className="font-semibold mb-2">Totais</h2>
          <div className="space-y-2">
            <p><span className="font-medium">Área Total:</span> {request.area} m²</p>
            <p><span className="font-medium">Peso Total:</span> {request.peso} t</p>
          </div>
        </div>
      </div>

      <div>
        <h2 className="font-semibold mb-4">Lista de Ruas</h2>
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
      </div>
    </div>
  );
}