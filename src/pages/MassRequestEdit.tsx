import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { MassRequestForm } from "@/components/mass-requests/MassRequestForm";
import { AuthProvider } from "@/hooks/useAuth";

export default function MassRequestEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: request, isLoading } = useQuery({
    queryKey: ["mass-request", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bd_requisicao")
        .select(`
          *,
          bd_ruas_requisicao(*)
        `)
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });

  const handleSuccess = () => {
    navigate("/mass-requests");
  };

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <AuthProvider>
      <div className="container mx-auto py-10">
        <Button
          variant="outline"
          onClick={() => navigate("/mass-requests")}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>

        <Card className="p-6">
          <h1 className="text-2xl font-bold mb-6">Editar Requisição de Massa</h1>
          <MassRequestForm initialData={request} onSuccess={handleSuccess} />
        </Card>
      </div>
    </AuthProvider>
  );
}