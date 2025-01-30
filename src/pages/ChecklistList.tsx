import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChecklistFilters } from "@/components/checklist/ChecklistFilters";
import { ChecklistTable } from "@/components/checklist/ChecklistTable";
import { useNavigate } from "react-router-dom";

export default function ChecklistList() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [operatorFilter, setOperatorFilter] = useState("");
  const [dateFilter, setDateFilter] = useState<Date>();
  const [equipmentFilter, setEquipmentFilter] = useState("");
  const [userPermission, setUserPermission] = useState<string>();

  const { data: checklists, isLoading } = useQuery({
    queryKey: ["checklists", operatorFilter, dateFilter, equipmentFilter],
    queryFn: async () => {
      let query = supabase
        .from("bd_apontamentocaminhaoequipamento")
        .select(`
          id,
          data,
          hora_inicial,
          caminhao_equipamento:caminhao_equipamento_id(
            tipo,
            modelo
          ),
          centro_custo:centro_custo_id(
            nome
          )
        `);

      if (operatorFilter) {
        query = query.ilike("operador", `%${operatorFilter}%`);
      }

      if (dateFilter) {
        query = query.eq("data", format(dateFilter, "yyyy-MM-dd"));
      }

      if (equipmentFilter) {
        query = query.ilike(
          "caminhao_equipamento.modelo",
          `%${equipmentFilter}%`
        );
      }

      const { data, error } = await query;

      if (error) throw error;
      return data;
    },
  });

  useQuery({
    queryKey: ["user-permission"],
    queryFn: async () => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from("bd_rhasfalto")
        .select("permissao_usuario")
        .eq("id", user.id)
        .single();

      if (error) throw error;

      setUserPermission(data?.permissao_usuario);
      return data;
    },
  });

  const canEditDelete = (checklist: any) => {
    if (userPermission === "planejamento") return true;
    
    const checklistDate = new Date(checklist.data);
    checklistDate.setHours(
      parseInt(checklist.hora_inicial.split(":")[0]),
      parseInt(checklist.hora_inicial.split(":")[1])
    );
    
    const now = new Date();
    const hoursDifference = Math.abs(now.getTime() - checklistDate.getTime()) / 36e5;
    
    return hoursDifference <= 24;
  };

  const handleView = async (checklist: any) => {
    navigate(`/checklists/${checklist.id}`);
  };

  const handleEdit = async (checklist: any) => {
    navigate(`/checklists/${checklist.id}/edit`);
  };

  const handleDelete = async (checklist: any) => {
    if (!confirm("Tem certeza que deseja excluir este checklist?")) return;

    try {
      const { error } = await supabase
        .from("bd_apontamentocaminhaoequipamento")
        .delete()
        .eq("id", checklist.id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Checklist excluído com sucesso",
      });
    } catch (error) {
      console.error("Error deleting checklist:", error);
      toast({
        title: "Erro",
        description: "Erro ao excluir checklist",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Lista de Checklists</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <ChecklistFilters
            operatorFilter={operatorFilter}
            setOperatorFilter={setOperatorFilter}
            dateFilter={dateFilter}
            setDateFilter={setDateFilter}
            equipmentFilter={equipmentFilter}
            setEquipmentFilter={setEquipmentFilter}
          />
          <ChecklistTable
            checklists={checklists || []}
            canEditDelete={canEditDelete}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>
    </div>
  );
}