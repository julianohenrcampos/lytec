import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
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
import { useIsMobile } from "@/hooks/use-mobile";

interface ChecklistFormProps {
  form: UseFormReturn<any>;
  onBack: () => void;
  onSubmit: (data: any) => void;
}

const checklistItems = [
  "Verificar nível óleo (motor, transmissão, hidráulico etc)",
  "Verificar água (radiador e limpador de para-brisa)",
  "Verificar nível de combustível",
  "Drenar torneira tanque de ar",
  "Inspecionar material rodante",
  "Inspecionar cinto de segurança e retrovisores",
  "Inspecionar material de desgaste",
  "Inspecionar estado de implementos ou equipamentos rebocáveis",
  "Inspecionar tacógrafo",
  "Limpeza interna do veículo ou equipamento",
  "Dar uma volta ao redor do equipamento para verificar se há obstáculos, parafuso solto ou faltante",
  "Colocar o motor em funcionamento e checar as condições gerais de funcionamento (freio, câmbio, comandos, controles etc)",
  "Ficar atento aos ruídos anormais",
  "Verificar funcionamento do sistema elétrico",
  "Verificar toda documentação, inclusive reboque",
  "Verificar o estado do sistema de engate do reboque",
  "Verificar o estado dos equipamentos obrigatórios",
  "Certificar-se das validades de inspeção veicular e vistoria do veículo ou equipamento",
  "Material de Amarração (Lona)",
];

export function ChecklistForm({ form, onBack, onSubmit }: ChecklistFormProps) {
  const isMobile = useIsMobile();

  const handleSubmit = (data: any) => {
    const checklist = checklistItems.reduce((acc, item) => {
      acc[item] = data[`checklist.${item}`];
      return acc;
    }, {} as Record<string, string>);

    const formData = {
      ...data,
      checklist,
    };

    onSubmit(formData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className={`grid grid-cols-1 ${isMobile ? 'gap-4' : 'md:grid-cols-2 gap-4'}`}>
          {checklistItems.map((item) => (
            <FormField
              key={item}
              control={form.control}
              name={`checklist.${item}`}
              rules={{ required: "Este item precisa ser avaliado" }}
              render={({ field }) => (
                <FormItem className={`bg-white ${isMobile ? 'p-3' : 'p-4'} rounded-lg shadow-sm`}>
                  <FormLabel className="text-sm font-medium">{item}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione uma opção" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="C">Conforme (C)</SelectItem>
                      <SelectItem value="NC">Não Conforme (NC)</SelectItem>
                      <SelectItem value="NA">Não Aplicável (NA)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>

        <div className={`flex ${isMobile ? 'flex-col' : ''} gap-4 justify-end`}>
          <Button 
            type="button" 
            variant="outline" 
            onClick={onBack}
            className={isMobile ? 'w-full' : ''}
          >
            Voltar
          </Button>
          <Button 
            type="submit"
            className={isMobile ? 'w-full' : ''}
          >
            Finalizar
          </Button>
        </div>
      </form>
    </Form>
  );
}