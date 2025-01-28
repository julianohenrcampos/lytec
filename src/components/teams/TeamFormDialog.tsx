import React, { useState, useEffect } from "react";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Plus, Search, X } from "lucide-react";
import { z } from "zod";

const teamSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  encarregado_id: z.string().min(1, "Encarregado é obrigatório"),
  apontador_id: z.string().min(1, "Apontador é obrigatório"),
});

type TeamFormValues = z.infer<typeof teamSchema>;

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

  // Query to get teams for the name dropdown
  const { data: teams } = useQuery({
    queryKey: ["teams"],
    queryFn: async () => {
      const { data } = await supabase
        .from("bd_equipe")
        .select("id, nome")
        .order("nome");
      return data || [];
    },
  });

  // Query to get employees filtered by function
  const { data: encarregados } = useQuery({
    queryKey: ["encarregados"],
    queryFn: async () => {
      const { data } = await supabase
        .from("bd_rhasfalto")
        .select("id, nome, funcao_id, funcao:bd_funcao(id, nome)")
        .eq("ativo", true)
        .eq("funcao:bd_funcao.nome", "Encarregado");
      return data || [];
    },
  });

  const { data: apontadores } = useQuery({
    queryKey: ["apontadores"],
    queryFn: async () => {
      const { data } = await supabase
        .from("bd_rhasfalto")
        .select("id, nome, funcao_id, funcao:bd_funcao(id, nome)")
        .eq("ativo", true)
        .eq("funcao:bd_funcao.nome", "Apontador");
      return data || [];
    },
  });

  const { data: employees } = useQuery({
    queryKey: ["employees"],
    queryFn: async () => {
      const { data } = await supabase
        .from("bd_rhasfalto")
        .select("id, nome, matricula")
        .eq("ativo", true);
      return data || [];
    },
  });

  // Update selected employees when encarregado or apontador changes
  useEffect(() => {
    const encarregadoId = form.watch("encarregado_id");
    const apontadorId = form.watch("apontador_id");
    
    if (encarregadoId || apontadorId) {
      const uniqueEmployees = new Set([...selectedEmployees]);
      
      if (encarregadoId) uniqueEmployees.add(encarregadoId);
      if (apontadorId) uniqueEmployees.add(apontadorId);
      
      setSelectedEmployees(Array.from(uniqueEmployees));
    }
  }, [form.watch("encarregado_id"), form.watch("apontador_id")]);

  const filteredEmployees = employees?.filter(
    (employee) =>
      (employee.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.matricula.toLowerCase().includes(searchTerm.toLowerCase())) &&
      !selectedEmployees.includes(employee.id)
  );

  const createTeam = useMutation({
    mutationFn: async (values: TeamFormValues) => {
      const { error } = await supabase.from("bd_equipe").insert([
        {
          nome: values.nome,
          encarregado_id: values.encarregado_id,
          apontador_id: values.apontador_id,
          colaboradores: selectedEmployees,
        },
      ]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
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
      setSearchTerm(""); // Clear search after adding
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
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Equipe</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um nome para a equipe" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {teams?.map((team) => (
                        <SelectItem key={team.id} value={team.nome}>
                          {team.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="encarregado_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Encarregado</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um encarregado" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {encarregados?.map((employee) => (
                        <SelectItem key={employee.id} value={employee.id}>
                          {employee.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="apontador_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Apontador</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um apontador" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {apontadores?.map((employee) => (
                        <SelectItem key={employee.id} value={employee.id}>
                          {employee.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel>Colaboradores</FormLabel>
              <div className="flex gap-2">
                <Input
                  placeholder="Buscar colaborador..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1"
                />
                <Button type="button" variant="outline">
                  <Search className="h-4 w-4" />
                </Button>
              </div>

              <div className="border rounded-md p-2 min-h-[100px] space-y-2">
                {selectedEmployees.map((employeeId) => {
                  const employee = employees?.find((e) => e.id === employeeId);
                  return (
                    <div
                      key={employeeId}
                      className="flex items-center justify-between bg-secondary p-2 rounded-md"
                    >
                      <span>{employee?.nome}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveEmployee(employeeId)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>

              {searchTerm && (
                <div className="border rounded-md mt-2">
                  {filteredEmployees?.map((employee) => (
                    <div
                      key={employee.id}
                      className="p-2 hover:bg-secondary cursor-pointer flex justify-between items-center"
                    >
                      <span>{employee.nome} - {employee.matricula}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleAddEmployee(employee.id)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

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