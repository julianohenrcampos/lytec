import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format, subHours } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarIcon, Eye, Pencil, Trash2, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ChecklistList() {
  const [filters, setFilters] = useState({
    operator: "",
    date: null as Date | null,
    equipment: "",
  });
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: userPermission } = useQuery({
    queryKey: ["user-permission", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data } = await supabase
        .from("bd_rhasfalto")
        .select("permissao_usuario")
        .eq("id", user.id)
        .maybeSingle();
      return data?.permissao_usuario;
    },
  });

  const { data: checklists, refetch } = useQuery({
    queryKey: ["checklists", filters],
    queryFn: async () => {
      let query = supabase
        .from("bd_apontamentocaminhaoequipamento")
        .select(`
          *,
          bd_caminhaoequipamento (
            tipo,
            modelo,
            placa
          )
        `)
        .order("data", { ascending: false });

      if (filters.operator) {
        query = query.ilike("operator", `%${filters.operator}%`);
      }
      if (filters.date) {
        query = query.eq("data", format(filters.date, "yyyy-MM-dd"));
      }
      if (filters.equipment) {
        query = query.eq("caminhao_equipamento_id", filters.equipment);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data;
    },
  });

  const { data: equipments } = useQuery({
    queryKey: ["equipments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bd_caminhaoequipamento")
        .select("id, tipo, modelo, placa")
        .order("tipo");
      
      if (error) throw error;
      return data;
    },
  });

  const canEditDelete = (checklist: any) => {
    if (userPermission === "admin") return true;
    
    const checklistDate = new Date(checklist.data);
    checklistDate.setHours(
      parseInt(checklist.hora_inicial.split(":")[0]),
      parseInt(checklist.hora_inicial.split(":")[1])
    );
    
    const now = new Date();
    const hoursDiff = (now.getTime() - checklistDate.getTime()) / (1000 * 60 * 60);
    
    return hoursDiff <= 24;
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from("bd_apontamentocaminhaoequipamento")
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Erro ao excluir checklist",
        description: error.message,
      });
      return;
    }

    toast({
      title: "Checklist excluído com sucesso",
    });
    refetch();
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Operador</label>
              <Input
                placeholder="Nome do operador"
                value={filters.operator}
                onChange={(e) =>
                  setFilters({ ...filters, operator: e.target.value })
                }
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Data</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    {filters.date ? (
                      format(filters.date, "dd/MM/yyyy")
                    ) : (
                      <span>Selecione uma data</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={filters.date || undefined}
                    onSelect={(date) =>
                      setFilters({ ...filters, date })
                    }
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Caminhão/Equipamento</label>
              <Select
                value={filters.equipment}
                onValueChange={(value) =>
                  setFilters({ ...filters, equipment: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um equipamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  {equipments?.map((equipment) => (
                    <SelectItem key={equipment.id} value={equipment.id}>
                      {`${equipment.tipo} - ${equipment.modelo} ${
                        equipment.placa ? `(${equipment.placa})` : ""
                      }`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Hora Inicial</TableHead>
                <TableHead>Equipamento</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Centro de Custo</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {checklists?.map((checklist) => (
                <TableRow key={checklist.id}>
                  <TableCell>
                    {format(new Date(checklist.data), "dd/MM/yyyy")}
                  </TableCell>
                  <TableCell>{checklist.hora_inicial}</TableCell>
                  <TableCell>
                    {`${checklist.bd_caminhaoequipamento.tipo} - ${
                      checklist.bd_caminhaoequipamento.modelo
                    } ${
                      checklist.bd_caminhaoequipamento.placa
                        ? `(${checklist.bd_caminhaoequipamento.placa})`
                        : ""
                    }`}
                  </TableCell>
                  <TableCell>{checklist.status}</TableCell>
                  <TableCell>{checklist.centro_custo_id}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          navigate(`/inspection-checklist/${checklist.id}`)
                        }
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {canEditDelete(checklist) && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              navigate(`/inspection-checklist/${checklist.id}/edit`)
                            }
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Confirmar exclusão
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja excluir este checklist?
                                  Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(checklist.id)}
                                >
                                  Confirmar
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}