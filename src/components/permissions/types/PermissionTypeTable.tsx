import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PermissionTypeForm } from "./PermissionTypeForm";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

interface PermissionType {
  id: string;
  name: string;
  label: string;
  description: string | null;
  active: boolean;
}

export function PermissionTypeTable() {
  const [showForm, setShowForm] = useState(false);
  const [selectedType, setSelectedType] = useState<PermissionType | null>(null);

  const { data: permissionTypes, refetch } = useQuery({
    queryKey: ["permissionTypes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("permission_types")
        .select("*")
        .order("label");

      if (error) throw error;
      return data as PermissionType[];
    },
  });

  const handleToggleActive = async (type: PermissionType) => {
    try {
      const { error } = await supabase
        .from("permission_types")
        .update({ active: !type.active })
        .eq("id", type.id);

      if (error) throw error;

      toast.success("Status atualizado com sucesso");
      refetch();
    } catch (error) {
      console.error("Error toggling active status:", error);
      toast.error("Erro ao atualizar status");
    }
  };

  const handleEdit = (type: PermissionType) => {
    setSelectedType(type);
    setShowForm(true);
  };

  const handleSuccess = () => {
    setShowForm(false);
    setSelectedType(null);
    refetch();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Tipos de Permissão</h2>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Tipo
        </Button>
      </div>

      {showForm && (
        <PermissionTypeForm
          permissionType={selectedType}
          onSuccess={handleSuccess}
          onCancel={() => {
            setShowForm(false);
            setSelectedType(null);
          }}
        />
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Identificador</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Ativo</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {permissionTypes?.map((type) => (
            <TableRow key={type.id}>
              <TableCell>{type.label}</TableCell>
              <TableCell>{type.name}</TableCell>
              <TableCell>{type.description || "-"}</TableCell>
              <TableCell>
                <Switch
                  checked={type.active}
                  onCheckedChange={() => handleToggleActive(type)}
                />
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(type)}
                >
                  Editar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}