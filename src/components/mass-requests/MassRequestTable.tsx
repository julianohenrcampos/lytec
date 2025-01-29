import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { MassRequest } from "./types";
import { MassRequestTableHeader } from "./table/TableHeader";
import { MassRequestTableRow } from "./table/TableRow";

interface MassRequestTableProps {
  filters: {
    data_inicio: Date | null;
    data_fim: Date | null;
    centro_custo: string;
  };
}

export function MassRequestTable({ filters }: MassRequestTableProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const { data: userPermission } = useQuery({
    queryKey: ["user-permission", user?.id],
    queryFn: async () => {
      if (!user?.id) {
        console.log("No user ID available");
        return null;
      }

      console.log("Fetching permissions for user:", user.id);
      const { data, error } = await supabase
        .from("bd_rhasfalto")
        .select("permissao_usuario")
        .eq("id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching user permission:", error);
        return null;
      }

      console.log("User permission data:", data);
      return data?.permissao_usuario;
    },
    enabled: !!user?.id,
  });

  const { data: requests, isLoading } = useQuery({
    queryKey: ["mass-requests", filters],
    queryFn: async () => {
      console.log("Fetching mass requests with filters:", filters);
      let query = supabase
        .from("bd_requisicao")
        .select(`
          *,
          bd_ruas_requisicao(*),
          bd_programacaomassa(volume)
        `)
        .order("created_at", { ascending: false });

      if (filters.data_inicio && filters.data_fim) {
        query = query
          .gte("data", filters.data_inicio.toISOString())
          .lte("data", filters.data_fim.toISOString());
      }

      if (filters.centro_custo !== "_all") {
        query = query.eq("centro_custo", filters.centro_custo);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching mass requests:", error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar requisições",
          description: "Ocorreu um erro ao carregar as requisições de massa.",
        });
        return [];
      }

      console.log("Mass requests data:", data);
      return data?.map(request => ({
        ...request,
        quantidade_programada: request.bd_programacaomassa?.reduce((acc: number, curr: any) => acc + (curr.volume || 0), 0) || 0
      })) || [];
    },
    enabled: true,
  });

  const handleNewProgramming = (request: MassRequest) => {
    navigate("/mass-programming/new", {
      state: { request },
    });
  };

  const handleEdit = (request: MassRequest) => {
    navigate(`/mass-requests/${request.id}/edit`, {
      state: { request },
    });
  };

  const handleView = (request: MassRequest) => {
    navigate(`/mass-requests/${request.id}`);
  };

  const handleDelete = async (request: MassRequest) => {
    const { error } = await supabase
      .from("bd_requisicao")
      .delete()
      .eq("id", request.id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Erro ao excluir requisição",
        description: "Ocorreu um erro ao excluir a requisição de massa.",
      });
      return;
    }

    toast({
      title: "Requisição excluída",
      description: "A requisição de massa foi excluída com sucesso.",
    });
  };

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <Table>
      <MassRequestTableHeader />
      <TableBody>
        {requests && requests.length > 0 ? (
          requests.map((request) => (
            <MassRequestTableRow
              key={request.id}
              request={request}
              userPermission={userPermission}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onNewProgramming={handleNewProgramming}
            />
          ))
        ) : (
          <tr>
            <td colSpan={7} className="text-center py-4">
              Nenhuma requisição encontrada
            </td>
          </tr>
        )}
      </TableBody>
    </Table>
  );
}