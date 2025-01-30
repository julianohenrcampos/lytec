import { useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GeneralInfoForm } from "@/components/truck-equipment-appointment/GeneralInfoForm";
import { ChecklistForm } from "@/components/truck-equipment-appointment/ChecklistForm";
import { useToast } from "@/hooks/use-toast";

type AppointmentStep = "general-info" | "checklist";

export default function TruckEquipmentAppointment() {
  const [currentStep, setCurrentStep] = useState<AppointmentStep>("general-info");
  const { toast } = useToast();
  const form = useForm();

  const handleNext = () => {
    const isValid = form.trigger();
    if (isValid) {
      setCurrentStep("checklist");
    } else {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios antes de avançar.",
        variant: "destructive",
      });
    }
  };

  const handleBack = () => {
    setCurrentStep("general-info");
  };

  const handleSubmit = async (data: any) => {
    try {
      const { error } = await supabase
        .from("bd_apontamentocaminhaoequipamento")
        .insert([data]);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Apontamento registrado com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao registrar apontamento.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>
            {currentStep === "general-info"
              ? "Adicionar Apontamento"
              : "Checklist de Inspeção"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {currentStep === "general-info" ? (
            <GeneralInfoForm form={form} onNext={handleNext} />
          ) : (
            <ChecklistForm
              form={form}
              onBack={handleBack}
              onSubmit={handleSubmit}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}