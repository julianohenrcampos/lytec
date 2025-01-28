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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";
import { TeamNameField } from "./TeamNameField";
import { EmployeeSelect } from "./EmployeeSelect";
import { CollaboratorSearch } from "./CollaboratorSearch";
import { teamSchema, TeamFormValues } from "./types";

export const TeamFormDialog = () => {
  const [open, setOpen] = useState(false);
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

  // Query to get function IDs first
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

  // Query to get encarregados using the function ID
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
      return data || [];
    },
    enabled: !!functionIds?.encarregadoId,
  });

  // Query to get apontadores using the function ID
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
      return data || [];
    },
    enabled: !!functionIds?.apontadorId,
  });

  // Query to get all active employees for collaborator selection
  const { data: employees } = useQuery({
    queryKey: ["employees"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bd_rhasfalto")
        .select("id, nome, matricula")
        .eq("ativo", true);
      
      if (error) throw error;
      return data || [];
    },
  });

  // Watch for encarregado_id changes to update team name and add to collaborators
  useEffect(() => {
    const encarregadoId = form.watch("encarregado_id");
    if (encarregadoId) {
      const selectedEncarregado = encarregados?.find(e => e.id === encarregadoId);
      if (selectedEncarregado) {
        form.setValue("nome", `Equipe ${selectedEncarregado.nome}`);
        // Add encarregado to collaborators if not already present
        if (!selectedEmployees.includes(encarregadoId)) {
          setSelectedEmployees(prev => [...prev, encarregadoId]);
        }
      }
    }
  }, [form.watch("encarregado_id"), encarregados]);

  // Watch for apontador_id changes to add to collaborators
  useEffect(() => {
    const apontadorId = form.watch("apontador_id");
    if (apontadorId && !selectedEmployees.includes(apontadorId)) {
      setSelectedEmployees(prev => [...prev, apontadorId]);
    }
  }, [form.watch("apontador_id")]);

  const createTeam = useMutation({
    mutationFn: async (values: TeamFormValues) => {
      // First create the team
      const { data: teamData, error: teamError } = await supabase
        .from("bd_equipe")
        .insert([
          {
            nome: values.nome,
            encarregado_id: values.encarregado_id,
            apontador_id: values.apontador_id,
            colaboradores: selectedEmployees,
          },
        ])
        .select()
        .single();

      if (teamError) throw teamError;

      // Then update all selected employees with the new team_id
      const { error: updateError } = await supabase
        .from("bd_rhasfalto")
        .update({ equipe_id: teamData.id })
        .in("id", selectedEmployees);

      if (updateError) throw updateError;

      return teamData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast({ title: "Equipe cadastrada com sucesso!" });
      setOpen(false);
      form.reset();
      setSelectedEmployees([]);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erro ao cadastrar equipe",
        description: error.message,
      });
    },
  });

  const onSubmit = (values: TeamFormValues) => {
    createTeam.mutate(values);
  };

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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Equipe
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Nova Equipe</DialogTitle>
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
                onClick={() => setOpen(false)}
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