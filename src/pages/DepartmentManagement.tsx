import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import type { Database } from "@/integrations/supabase/types";
import { DepartmentForm, type FormValues } from "@/components/departments/DepartmentForm";
import { DepartmentTable } from "@/components/departments/DepartmentTable";

type Department = Database["public"]["Tables"]["bd_departamento"]["Row"];
type DepartmentInsert = Database["public"]["Tables"]["bd_departamento"]["Insert"];

export default function DepartmentManagement() {
  const [isOpen, setIsOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: departments, isLoading } = useQuery({
    queryKey: ["departments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bd_departamento")
        .select("*")
        .order("nome");
      if (error) throw error;
      return data as Department[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const departmentData: DepartmentInsert = {
        nome: values.nome,
      };
      const { error } = await supabase
        .from("bd_departamento")
        .insert([departmentData]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      setIsOpen(false);
      toast({
        title: "Sucesso",
        description: "Departamento criado com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao criar departamento: " + error.message,
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      if (!editingDepartment?.id) return;
      const departmentData: DepartmentInsert = {
        nome: values.nome,
      };
      const { error } = await supabase
        .from("bd_departamento")
        .update(departmentData)
        .eq("id", editingDepartment.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      setIsOpen(false);
      setEditingDepartment(null);
      toast({
        title: "Sucesso",
        description: "Departamento atualizado com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao atualizar departamento: " + error.message,
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("bd_departamento")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      toast({
        title: "Sucesso",
        description: "Departamento excluído com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao excluir departamento: " + error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (values: FormValues) => {
    if (editingDepartment) {
      updateMutation.mutate(values);
    } else {
      createMutation.mutate(values);
    }
  };

  const handleEdit = (department: Department) => {
    setEditingDepartment(department);
    setIsOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setEditingDepartment(null);
    }
  };

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gerenciamento de Departamentos</h1>
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button>Novo Departamento</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingDepartment ? "Editar Departamento" : "Novo Departamento"}
              </DialogTitle>
            </DialogHeader>
            <DepartmentForm
              onSubmit={handleSubmit}
              initialData={editingDepartment || undefined}
              isSubmitting={createMutation.isPending || updateMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>

      <DepartmentTable
        departments={departments || []}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}