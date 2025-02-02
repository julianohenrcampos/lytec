import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { GeneralInfoForm } from "@/components/truck-equipment-appointment/GeneralInfoForm";
import { ChecklistForm } from "@/components/truck-equipment-appointment/ChecklistForm";
import { useIsMobile } from "@/hooks/use-mobile";

export default function InspectionChecklist() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const form = useForm();
  const isMobile = useIsMobile();

  const handleSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      
      const { error } = await supabase
        .from('bd_apontamentocaminhaoequipamento')
        .insert({
          data: data.data,
          centro_custo_id: data.centro_custo_id,
          status: data.status,
          caminhao_equipamento_id: data.caminhao_equipamento_id,
          hora_inicial: data.hora_inicial,
          hora_final: data.hora_final,
          horimetro_inicial: data.horimetro_inicial,
          horimetro_final: data.horimetro_final,
          abastecimento: data.abastecimento,
          anotacoes: data.anotacoes,
          checklist: data.checklist || {},
        });

      if (error) throw error;

      toast.success('Checklist salvo com sucesso!');
      form.reset();
      setCurrentStep(1);
    } catch (error) {
      console.error('Error saving checklist:', error);
      toast.error('Erro ao salvar checklist');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`min-h-screen bg-background ${isMobile ? 'p-0' : 'container mx-auto py-6'}`}>
      <Card className={`${isMobile ? 'rounded-none shadow-none border-0 min-h-screen' : ''}`}>
        <CardHeader className={`${isMobile ? 'px-4 py-3' : ''}`}>
          <CardTitle>
            {currentStep === 1
              ? "Apontamento de Caminhão/Equipamentos"
              : "Checklist - Itens a Serem Inspecionados"}
          </CardTitle>
        </CardHeader>
        <CardContent className={`${isMobile ? 'p-4' : ''}`}>
          {currentStep === 1 ? (
            <GeneralInfoForm
              form={form}
              onNext={() => setCurrentStep(2)}
            />
          ) : (
            <ChecklistForm
              form={form}
              onBack={() => setCurrentStep(1)}
              onSubmit={handleSubmit}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}