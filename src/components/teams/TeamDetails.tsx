import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";

export function TeamDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: team, isLoading } = useQuery({
    queryKey: ["team", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bd_equipe")
        .select(`
          *,
          encarregado:bd_rhasfalto!bd_equipe_encarregado_id_fkey(nome),
          apontador:bd_rhasfalto!bd_equipe_apontador_id_fkey(nome),
          membros:bd_rhasfalto!bd_rhasfalto_equipe_id_fkey(id, nome, matricula)
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

  return (
    <Dialog open={true} onOpenChange={() => navigate("/teams")}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Detalhes da Equipe</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/teams")}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold">Informações Gerais</h3>
            <div className="mt-2 space-y-2">
              <p><span className="font-medium">Nome:</span> {team?.nome}</p>
              <p><span className="font-medium">Encarregado:</span> {team?.encarregado?.nome}</p>
              <p><span className="font-medium">Apontador:</span> {team?.apontador?.nome}</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Membros da Equipe</h3>
            <div className="mt-2 space-y-2">
              {team?.membros?.map((membro: any) => (
                <div
                  key={membro.id}
                  className="flex items-center justify-between bg-secondary p-2 rounded-md"
                >
                  <span>{membro.nome}</span>
                  <span className="text-sm text-muted-foreground">{membro.matricula}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}