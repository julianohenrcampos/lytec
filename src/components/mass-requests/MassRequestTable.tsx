import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody } from "@/components/ui/table";
import { MassRequest } from "./types";
import { MassRequestTableHeader } from "./table/TableHeader";
import { MassRequestRow } from "./table/MassRequestRow";
import { StreetRow } from "./table/StreetRow";

interface MassRequestTableProps {
  onEdit: (request: MassRequest) => void;
}

export function MassRequestTable({ onEdit }: MassRequestTableProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  const toggleRow = (id: string) => {
    setExpandedRows(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const { data: requests, isLoading } = useQuery({
    queryKey: ["mass-requests"],
    queryFn: async () => {
      const { data: mainRequests, error: mainError } = await supabase
        .from("bd_requisicao")
        .select("*")
        .order("created_at", { ascending: false });

      if (mainError) throw mainError;

      const requestsWithStreets = await Promise.all(
        mainRequests.map(async (request) => {
          const { data: streets, error: streetsError } = await supabase
            .from("bd_ruas_requisicao")
            .select("*")
            .eq("requisicao_id", request.id);

          if (streetsError) throw streetsError;

          return {
            ...request,
            streets: streets || [],
          };
        })
      );

      return requestsWithStreets as MassRequest[];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("bd_requisicao")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mass-requests"] });
      toast({
        title: "Requisição excluída com sucesso!",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Erro ao excluir requisição",
        description: error.message,
      });
    },
  });

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="space-y-4">
      <Table>
        <MassRequestTableHeader />
        <TableBody>
          {requests?.map((request) => (
            <div key={request.id} className="border-b border-gray-200">
              <MassRequestRow
                request={request}
                isExpanded={expandedRows[request.id]}
                onToggleExpand={() => toggleRow(request.id)}
                onEdit={onEdit}
                onDelete={(id) => deleteMutation.mutate(id)}
              />
              {expandedRows[request.id] && request.streets?.map((street) => (
                <StreetRow key={street.id} street={street} />
              ))}
            </div>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}