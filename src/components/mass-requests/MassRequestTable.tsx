import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ChevronDown, ChevronRight, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";

interface Street {
  id: string;
  logradouro: string;
  bairro?: string;
  largura: number;
  comprimento: number;
  espessura: number;
  area: number;
  peso: number;
}

interface MassRequest {
  id: string;
  centro_custo: string;
  diretoria?: string;
  gerencia?: string;
  engenheiro: string;
  data: string;
  logradouro: string;
  bairro?: string;
  largura: number;
  comprimento: number;
  ligante?: string;
  area: number;
  espessura: number;
  peso: number;
  created_at: string;
  streets?: Street[];
}

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
      // Fetch main requests
      const { data: mainRequests, error: mainError } = await supabase
        .from("bd_requisicao")
        .select("*")
        .order("created_at", { ascending: false });

      if (mainError) throw mainError;

      // Fetch additional streets for each request
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
      // The streets will be deleted automatically due to ON DELETE CASCADE
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
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[40px]"></TableHead>
          <TableHead>Centro de Custo</TableHead>
          <TableHead>Diretoria</TableHead>
          <TableHead>Engenheiro</TableHead>
          <TableHead>Data</TableHead>
          <TableHead>Logradouro</TableHead>
          <TableHead>Bairro</TableHead>
          <TableHead>Área (m²)</TableHead>
          <TableHead>Peso (t)</TableHead>
          <TableHead>Traço</TableHead>
          <TableHead>Ligante</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {requests?.map((request) => (
          <>
            <TableRow key={request.id}>
              <TableCell>
                {request.streets && request.streets.length > 0 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleRow(request.id)}
                  >
                    {expandedRows[request.id] ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                )}
              </TableCell>
              <TableCell>{request.centro_custo}</TableCell>
              <TableCell>{request.diretoria || "-"}</TableCell>
              <TableCell>{request.engenheiro}</TableCell>
              <TableCell>{format(new Date(request.data), "dd/MM/yyyy")}</TableCell>
              <TableCell>{request.logradouro}</TableCell>
              <TableCell>{request.bairro || "-"}</TableCell>
              <TableCell>{request.area.toFixed(2)}</TableCell>
              <TableCell>{request.peso.toFixed(2)}</TableCell>
              <TableCell>{request.traco || "-"}</TableCell>
              <TableCell>{request.ligante || "-"}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onEdit(request)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja excluir esta requisição? Esta ação
                          não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteMutation.mutate(request.id)}
                        >
                          Excluir
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
            {expandedRows[request.id] && request.streets?.map((street) => (
              <TableRow key={street.id} className="bg-muted/50">
                <TableCell></TableCell>
                <TableCell colSpan={4}></TableCell>
                <TableCell>{street.logradouro}</TableCell>
                <TableCell>{street.bairro || "-"}</TableCell>
                <TableCell>{street.area.toFixed(2)}</TableCell>
                <TableCell>{street.peso.toFixed(2)}</TableCell>
                <TableCell>{street.traco || "-"}</TableCell>
                <TableCell>{street.ligante || "-"}</TableCell>
                <TableCell></TableCell>
              </TableRow>
            ))}
          </>
        ))}
      </TableBody>
    </Table>
  );
}
