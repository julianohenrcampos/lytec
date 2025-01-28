import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { useTeamQueries } from "./hooks/useTeamQueries";

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
  const { useEmployeesByFunction, useAllEmployees } = useTeamQueries();

  const form = useForm<TeamFormValues>({
    resolver: zodResolver(teamSchema),
    defaultValues: {
      nome: "",
      encarregado_id: "",
      apontador_id: "",
    },
  });

  const { data: encarregados } = useEmployeesByFunction("Encarregado");
  const { data: apontadores } = useEmployeesByFunction("Apontador");
  const { data: employees } = useAllEmployees();

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