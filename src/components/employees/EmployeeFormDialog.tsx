import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { format, addDays } from "date-fns";
import { Plus } from "lucide-react";

const employeeSchema = z.object({
  // Personal Data
  nome: z.string().min(1, "Nome é obrigatório"),
  cpf: z.string().min(11, "CPF inválido").max(14, "CPF inválido"),
  matricula: z.string().min(1, "Matrícula é obrigatória"),
  genero: z.boolean(),
  endereco: z.string().optional(),
  imagem: z.string().optional(),
  
  // Professional Data
  funcao_id: z.string().min(1, "Função é obrigatória"),
  centro_custo_id: z.string().min(1, "Centro de Custo é obrigatório"),
  empresa_id: z.string().min(1, "Empresa é obrigatória"),
  equipe_id: z.string().optional(),
  
  // Financial Data
  salario: z.number().min(1, "Salário é obrigatório"),
  insalubridade: z.number().optional(),
  periculosidade: z.number().optional(),
  gratificacao: z.number().optional(),
  adicional_noturno: z.number().optional(),
  custo_passagem: z.number().optional(),
  refeicao: z.number().optional(),
  diarias: z.number().optional(),
  
  // Contract Data
  admissao: z.string().min(1, "Data de Admissão é obrigatória"),
  demissao: z.string().optional(),
  ativo: z.boolean().default(true),
  aviso: z.boolean().default(false),
});

type EmployeeFormValues = z.infer<typeof employeeSchema>;

type FormStep = "personal" | "professional" | "financial" | "contract";

export const EmployeeFormDialog = () => {
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<FormStep>("personal");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      nome: "",
      cpf: "",
      matricula: "",
      genero: true,
      endereco: "",
      imagem: "",
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
      const { data } = await supabase.from("bd_empresa_proprietaria").select("*");
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
      const { error } = await supabase.from("bd_rhasfalto").insert({
        ...values,
        ferias,
        salario: Number(values.salario),
        insalubridade: values.insalubridade ? Number(values.insalubridade) : null,
        periculosidade: values.periculosidade ? Number(values.periculosidade) : null,
        gratificacao: values.gratificacao ? Number(values.gratificacao) : null,
        adicional_noturno: values.adicional_noturno ? Number(values.adicional_noturno) : null,
        custo_passagem: values.custo_passagem ? Number(values.custo_passagem) : null,
        refeicao: values.refeicao ? Number(values.refeicao) : null,
        diarias: values.diarias ? Number(values.diarias) : null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast({
        title: "Funcionário cadastrado com sucesso!",
      });
      setOpen(false);
      form.reset();
      setCurrentStep("personal");
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
    if (currentStep !== "contract") {
      const nextSteps: Record<FormStep, FormStep> = {
        personal: "professional",
        professional: "financial",
        financial: "contract",
        contract: "contract",
      };
      setCurrentStep(nextSteps[currentStep]);
      return;
    }
    createEmployee.mutate(values);
  };

  const handlePrevious = () => {
    const previousSteps: Record<FormStep, FormStep> = {
      personal: "personal",
      professional: "personal",
      financial: "professional",
      contract: "financial",
    };
    setCurrentStep(previousSteps[currentStep]);
  };

  const renderPersonalData = () => (
    <div className="space-y-4">
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
        name="genero"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Gênero</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={(value) => field.onChange(value === "true")}
                value={field.value ? "true" : "false"}
                className="flex space-x-4"
              >
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <RadioGroupItem value="true" />
                  </FormControl>
                  <FormLabel className="font-normal">
                    Masculino
                  </FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <RadioGroupItem value="false" />
                  </FormControl>
                  <FormLabel className="font-normal">
                    Feminino
                  </FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="endereco"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Endereço</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="imagem"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Imagem</FormLabel>
            <FormControl>
              <Input type="file" onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  // TODO: Implement file upload to Supabase storage
                  field.onChange(file.name);
                }
              }} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );

  const renderProfessionalData = () => (
    <div className="space-y-4">
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
    </div>
  );

  const renderFinancialData = () => (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="salario"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Salário</FormLabel>
            <FormControl>
              <Input
                type="number"
                step="0.01"
                onChange={(e) => field.onChange(Number(e.target.value))}
                value={field.value}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="insalubridade"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Insalubridade</FormLabel>
            <FormControl>
              <Input
                type="number"
                step="0.01"
                onChange={(e) => field.onChange(Number(e.target.value))}
                value={field.value}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="periculosidade"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Periculosidade</FormLabel>
            <FormControl>
              <Input
                type="number"
                step="0.01"
                onChange={(e) => field.onChange(Number(e.target.value))}
                value={field.value}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="gratificacao"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Gratificação</FormLabel>
            <FormControl>
              <Input
                type="number"
                step="0.01"
                onChange={(e) => field.onChange(Number(e.target.value))}
                value={field.value}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="adicional_noturno"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Adicional Noturno</FormLabel>
            <FormControl>
              <Input
                type="number"
                step="0.01"
                onChange={(e) => field.onChange(Number(e.target.value))}
                value={field.value}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="custo_passagem"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Custo de Passagem</FormLabel>
            <FormControl>
              <Input
                type="number"
                step="0.01"
                onChange={(e) => field.onChange(Number(e.target.value))}
                value={field.value}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="refeicao"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Refeição</FormLabel>
            <FormControl>
              <Input
                type="number"
                step="0.01"
                onChange={(e) => field.onChange(Number(e.target.value))}
                value={field.value}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="diarias"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Diárias</FormLabel>
            <FormControl>
              <Input
                type="number"
                step="0.01"
                onChange={(e) => field.onChange(Number(e.target.value))}
                value={field.value}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );

  const renderContractData = () => (
    <div className="space-y-4">
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

      {form.watch("admissao") && (
        <FormItem>
          <FormLabel>Data de Férias</FormLabel>
          <FormControl>
            <Input
              type="date"
              value={format(addDays(new Date(form.watch("admissao")), 365), "yyyy-MM-dd")}
              disabled
            />
          </FormControl>
        </FormItem>
      )}

      <FormField
        control={form.control}
        name="demissao"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Data de Demissão</FormLabel>
            <FormControl>
              <Input
                type="date"
                {...field}
                onChange={(e) => {
                  field.onChange(e.target.value);
                  if (e.target.value) {
                    form.setValue("aviso", true);
                  }
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="ativo"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center space-x-2 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <FormLabel>Ativo</FormLabel>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="aviso"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center space-x-2 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled={!!form.watch("demissao")}
              />
            </FormControl>
            <FormLabel>Aviso</FormLabel>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case "personal":
        return renderPersonalData();
      case "professional":
        return renderProfessionalData();
      case "financial":
        return renderFinancialData();
      case "contract":
        return renderContractData();
      default:
        return null;
    }
  };

  const stepTitles: Record<FormStep, string> = {
    personal: "Dados Pessoais",
    professional: "Dados Profissionais",
    financial: "Dados Financeiros",
    contract: "Informações Contratuais",
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Funcionário
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{stepTitles[currentStep]}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {renderStepContent()}
            <div className="flex justify-end space-x-2">
              {currentStep !== "personal" && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevious}
                >
                  Voltar
                </Button>
              )}
              <Button type="submit">
                {currentStep === "contract" ? "Salvar" : "Próximo"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
