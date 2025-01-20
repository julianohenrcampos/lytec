import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { format, addDays } from "date-fns";

const employeeSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  cpf: z.string().min(11, "CPF inválido").max(14, "CPF inválido"),
  matricula: z.string().min(1, "Matrícula é obrigatória"),
  funcao_id: z.string().min(1, "Função é obrigatória"),
  centro_custo_id: z.string().min(1, "Centro de Custo é obrigatório"),
  empresa_id: z.string().min(1, "Empresa é obrigatória"),
  equipe_id: z.string().optional(),
  salario: z.number().min(1, "Salário é obrigatório"),
  insalubridade: z.number().optional(),
  periculosidade: z.number().optional(),
  gratificacao: z.number().optional(),
  adicional_noturno: z.number().optional(),
  custo_passagem: z.number().optional(),
  refeicao: z.number().optional(),
  diarias: z.number().optional(),
  admissao: z.string().min(1, "Data de Admissão é obrigatória"),
  demissao: z.string().optional(),
  ativo: z.boolean().default(true),
  aviso: z.boolean().default(false),
  endereco: z.string().optional(),
  imagem: z.string().optional(),
  escolaridade: z.enum(["Fundamental", "Médio", "Técnico", "Superior"]),
  genero: z.boolean(),
});

type EmployeeFormValues = z.infer<typeof employeeSchema>;

export const EmployeeForm = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      nome: "",
      cpf: "",
      matricula: "",
      funcao_id: "",
      centro_custo_id: "",
      empresa_id: "",
      equipe_id: "",
      salario: 0,
      insalubridade: 0,
      periculosidade: 0,
      gratificacao: 0,
      adicional_noturno: 0,
      custo_passagem: 0,
      refeicao: 0,
      diarias: 0,
      admissao: "",
      demissao: "",
      ativo: true,
      aviso: false,
      endereco: "",
      imagem: "",
      escolaridade: "Médio",
      genero: true,
    },
  });

  const { data: funcoes } = useQuery({
    queryKey: ["funcoes"],
    queryFn: async () => {
      const { data } = await supabase.from("bd_funcao").select("*");
      return data || [];
    },
  });

  const { data: centrosCusto } = useQuery({
    queryKey: ["centrosCusto"],
    queryFn: async () => {
      const { data } = await supabase.from("bd_centrocusto").select("*");
      return data || [];
    },
  });

  const { data: empresas } = useQuery({
    queryKey: ["empresas"],
    queryFn: async () => {
      const { data } = await supabase.from("bd_empresa").select("*");
      return data || [];
    },
  });

  const { data: equipes } = useQuery({
    queryKey: ["equipes"],
    queryFn: async () => {
      const { data } = await supabase.from("bd_equipe").select("*");
      return data || [];
    },
  });

  const createEmployee = useMutation({
    mutationFn: async (values: EmployeeFormValues) => {
      const ferias = format(addDays(new Date(values.admissao), 365), "yyyy-MM-dd");
      const { error } = await supabase.from("bd_rhasfalto").insert([
        {
          nome: values.nome,
          cpf: values.cpf,
          matricula: values.matricula,
          funcao_id: values.funcao_id,
          centro_custo_id: values.centro_custo_id,
          empresa_id: values.empresa_id,
          equipe_id: values.equipe_id,
          salario: Number(values.salario),
          insalubridade: values.insalubridade ? Number(values.insalubridade) : null,
          periculosidade: values.periculosidade ? Number(values.periculosidade) : null,
          gratificacao: values.gratificacao ? Number(values.gratificacao) : null,
          adicional_noturno: values.adicional_noturno ? Number(values.adicional_noturno) : null,
          custo_passagem: values.custo_passagem ? Number(values.custo_passagem) : null,
          refeicao: values.refeicao ? Number(values.refeicao) : null,
          diarias: values.diarias ? Number(values.diarias) : null,
          admissao: values.admissao,
          demissao: values.demissao || null,
          ativo: values.ativo,
          aviso: values.aviso,
          endereco: values.endereco || null,
          imagem: values.imagem || null,
          escolaridade: values.escolaridade,
          genero: values.genero,
          ferias,
        },
      ]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast({
        title: "Funcionário cadastrado com sucesso!",
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erro ao cadastrar funcionário",
        description: error.message,
      });
    },
  });

  const onSubmit = (values: EmployeeFormValues) => {
    // Convert string values to numbers for numeric fields
    const numericValues = {
      ...values,
      salario: Number(values.salario),
      insalubridade: values.insalubridade ? Number(values.insalubridade) : undefined,
      periculosidade: values.periculosidade ? Number(values.periculosidade) : undefined,
      gratificacao: values.gratificacao ? Number(values.gratificacao) : undefined,
      adicional_noturno: values.adicional_noturno ? Number(values.adicional_noturno) : undefined,
      custo_passagem: values.custo_passagem ? Number(values.custo_passagem) : undefined,
      refeicao: values.refeicao ? Number(values.refeicao) : undefined,
      diarias: values.diarias ? Number(values.diarias) : undefined,
    };
    createEmployee.mutate(numericValues);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="nome"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cpf"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CPF</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="matricula"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Matrícula</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="funcao_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Função</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma função" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {funcoes?.map((funcao) => (
                      <SelectItem key={funcao.id} value={funcao.id}>
                        {funcao.nome}
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
            name="centro_custo_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Centro de Custo</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um centro de custo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {centrosCusto?.map((centro) => (
                      <SelectItem key={centro.id} value={centro.id}>
                        {centro.nome}
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
            name="empresa_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Empresa</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma empresa" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {empresas?.map((empresa) => (
                      <SelectItem key={empresa.id} value={empresa.id}>
                        {empresa.nome}
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
            name="equipe_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Equipe</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma equipe" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {equipes?.map((equipe) => (
                      <SelectItem key={equipe.id} value={equipe.id}>
                        {equipe.nome}
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
            name="salario"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Salário</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="admissao"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data de Admissão</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

        </div>

        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => form.reset()}
          >
            Cancelar
          </Button>
          <Button type="submit">Salvar</Button>
        </div>
      </form>
    </Form>
  );
};
