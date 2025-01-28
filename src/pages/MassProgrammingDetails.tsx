import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";

export default function MassProgrammingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: programming, isLoading } = useQuery({
    queryKey: ["mass-programming", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bd_programacaomassa")
        .select(`
          *,
          bd_centrocusto (nome),
          encarregado:bd_rhasfalto!bd_programacaomassa_encarregado_fkey (nome),
          apontador:bd_rhasfalto!bd_programacaomassa_apontador_fkey (nome)
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

  if (!programming) {
    return <div>Programação não encontrada</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <Button
        variant="outline"
        onClick={() => navigate("/mass-programming")}
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Voltar
      </Button>

      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-6">Detalhes da Programação</h2>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-medium">Data de Entrega</p>
            <p>{format(new Date(programming.data_entrega), "dd/MM/yyyy")}</p>
          </div>
          
          <div>
            <p className="font-medium">Tipo de Lançamento</p>
            <p>{programming.tipo_lancamento}</p>
          </div>
          
          <div>
            <p className="font-medium">Usina</p>
            <p>{programming.usina}</p>
          </div>
          
          <div>
            <p className="font-medium">Centro de Custo</p>
            <p>{programming.bd_centrocusto.nome}</p>
          </div>
          
          <div>
            <p className="font-medium">Logradouro</p>
            <p>{programming.logradouro}</p>
          </div>
          
          <div>
            <p className="font-medium">Encarregado</p>
            <p>{programming.encarregado.nome}</p>
          </div>
          
          <div>
            <p className="font-medium">Apontador</p>
            <p>{programming.apontador.nome}</p>
          </div>
          
          <div>
            <p className="font-medium">Caminhão</p>
            <p>{programming.caminhao || "-"}</p>
          </div>
          
          <div>
            <p className="font-medium">Volume (t)</p>
            <p>{programming.volume?.toLocaleString() || "-"}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}