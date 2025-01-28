import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { TeamNameField } from "./TeamNameField";
import { EmployeeSelect } from "./EmployeeSelect";
import { CollaboratorSearch } from "./CollaboratorSearch";
import { teamSchema, TeamFormValues } from "./types";

interface TeamFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  editingTeam?: {
    id: string;
    nome: string;
    encarregado_id: string;
    apontador_id: string;
    colaboradores: string[];
  } | null;
}

export const TeamFormDialog = ({ isOpen, onClose, editingTeam }: TeamFormDialogProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<TeamFormValues>({
    resolver: zodResolver(teamSchema),
    defaultValues: {
      nome: "",
      encarregado_id: "",
      apontador_id: "",
    },
  });

  // Effect to set form values when editing
  useEffect(() => {
    if (editingTeam) {
      form.reset({
        nome: editingTeam.nome,
        encarregado_id: editingTeam.encarregado_id,
        apontador_id: editingTeam.apontador_id,
      });
      setSelectedEmployees(editingTeam.colaboradores || []);
    } else {
      form.reset({
        nome: "",
        encarregado_id: "",
        apontador_id: "",
      });
      setSelectedEmployees([]);
    }
  }, [editingTeam, form]);

  // Query to get function IDs
  const { data: functionIds } = useQuery({
    queryKey: ["function-ids"],
    queryFn: async () => {
      const { data: encarregadoFunc } = await supabase
        .from("bd_funcao")
        .select("id")
        .eq("nome", "Encarregado")
        .single();

      const { data: apontadorFunc } = await supabase
        .from("bd_funcao")
        .select("id")
        .eq("nome", "Apontador")
        .single();

      return {
        encarregadoId: encarregadoFunc?.id,
        apontadorId: apontadorFunc?.id,
      };
    },
  });

  // Query to get encarregados
  const { data: encarregados } = useQuery({
    queryKey: ["encarregados", functionIds?.encarregadoId],
    queryFn: async () => {
      if (!functionIds?.encarregadoId) return [];
      const { data, error } = await supabase
        .from("bd_rhasfalto")
        .select("id, nome")
        .eq("ativo", true)
        .eq("funcao_id", functionIds.encarregadoId);
      if (error) throw error;
      return data;
    },
    enabled: !!functionIds?.encarregadoId,
  });

  // Query to get apontadores
  const { data: apontadores } = useQuery({
    queryKey: ["apontadores", functionIds?.apontadorId],
    queryFn: async () => {
      if (!functionIds?.apontadorId) return [];
      const { data, error } = await supabase
        .from("bd_rhasfalto")
        .select("id, nome")
        .eq("ativo", true)
        .eq("funcao_id", functionIds.apontadorId);
      if (error) throw error;
      return data;
    },
    enabled: !!functionIds?.apontadorId,
  });

  // Query to get all active employees
  const { data: employees } = useQuery({
    queryKey: ["employees"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bd_rhasfalto")
        .select("id, nome, matricula")
        .eq("ativo", true);
      if (error) throw error;
      return data;
    },
  });

  const createOrUpdateTeam = useMutation({
    mutationFn: async (values: TeamFormValues) => {
      const teamData = {
        nome: values.nome,
        encarregado_id: values.encarregado_id,
        apontador_id: values.apontador_id,
        colaboradores: selectedEmployees,
      };

      if (editingTeam) {
        const { error: updateError } = await supabase
          .from("bd_equipe")
          .update(teamData)
          .eq("id", editingTeam.id);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from("bd_equipe")
          .insert([teamData]);
        if (insertError) throw insertError;
      }

      // Update employee team assignments
      const { error: employeeUpdateError } = await supabase
        .from("bd_rhasfalto")
        .update({ equipe_id: editingTeam?.id || null })
        .in("id", selectedEmployees);

      if (employeeUpdateError) throw employeeUpdateError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast({ title: `Equipe ${editingTeam ? "atualizada" : "cadastrada"} com sucesso!` });
      onClose();
      form.reset();
      setSelectedEmployees([]);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: `Erro ao ${editingTeam ? "atualizar" : "cadastrar"} equipe`,
        description: error.message,
      });
    },
  });

  // Watch for encarregado_id changes to update team name
  useEffect(() => {
    const encarregadoId = form.watch("encarregado_id");
    if (encarregadoId) {
      const selectedEncarregado = encarregados?.find(e => e.id === encarregadoId);
      if (selectedEncarregado) {
        form.setValue("nome", `Equipe ${selectedEncarregado.nome}`);
        if (!selectedEmployees.includes(encarregadoId)) {
          setSelectedEmployees(prev => [...prev, encarregadoId]);
        }
      }
    }
  }, [form.watch("encarregado_id"), encarregados]);

  // Watch for apontador_id changes
  useEffect(() => {
    const apontadorId = form.watch("apontador_id");
    if (apontadorId && !selectedEmployees.includes(apontadorId)) {
      setSelectedEmployees(prev => [...prev, apontadorId]);
    }
  }, [form.watch("apontador_id")]);

  const handleAddEmployee = (employeeId: string) => {
    if (!selectedEmployees.includes(employeeId)) {
      setSelectedEmployees([...selectedEmployees, employeeId]);
      setSearchTerm("");
    }
  };

  const handleRemoveEmployee = (employeeId: string) => {
    const encarregadoId = form.getValues("encarregado_id");
    const apontadorId = form.getValues("apontador_id");
    
    if (employeeId === encarregadoId) {
      toast({
        variant: "destructive",
        title: "Não é possível remover o encarregado da equipe",
      });
      return;
    }
    
    if (employeeId === apontadorId) {
      toast({
        variant: "destructive",
        title: "Não é possível remover o apontador da equipe",
      });
      return;
    }

    setSelectedEmployees(selectedEmployees.filter((id) => id !== employeeId));
  };

  const filteredEmployees = employees?.filter(
    (employee) =>
      (employee.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.matricula.toLowerCase().includes(searchTerm.toLowerCase())) &&
      !selectedEmployees.includes(employee.id)
  );

  const onSubmit = (values: TeamFormValues) => {
    createOrUpdateTeam.mutate(values);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editingTeam ? "Editar" : "Nova"} Equipe</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <TeamNameField form={form} />
            
            <EmployeeSelect
              form={form}
              name="encarregado_id"
              label="Encarregado"
              employees={encarregados}
              placeholder="Selecione um encarregado"
            />

            <EmployeeSelect
              form={form}
              name="apontador_id"
              label="Apontador"
              employees={apontadores}
              placeholder="Selecione um apontador"
            />

            <CollaboratorSearch
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              filteredEmployees={filteredEmployees}
              selectedEmployees={selectedEmployees}
              onAddEmployee={handleAddEmployee}
              onRemoveEmployee={handleRemoveEmployee}
              employees={employees}
            />

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
              >
                Cancelar
              </Button>
              <Button type="submit">Salvar</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};