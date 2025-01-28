import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { RequestHeader } from "@/components/mass-requests/details/RequestHeader";
import { StreetDetails } from "@/components/mass-requests/details/StreetDetails";

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
          bd_ruas_requisicao (
            id,
            logradouro,
            bairro,
            largura,
            comprimento,
            area,
            ligante,
            traco,
            espessura,
            peso
          )
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

      <Card className="p-6 mb-6">
        <RequestHeader
          data={request.data}
          centro_custo={request.centro_custo}
          diretoria={request.diretoria}
          gerencia={request.gerencia}
          engenheiro={request.engenheiro}
        />
      </Card>

      <Card className="p-6">
        <StreetDetails
          streets={request.bd_ruas_requisicao}
          totalArea={request.area}
          totalWeight={request.peso}
        />
      </Card>
    </div>
  );
}