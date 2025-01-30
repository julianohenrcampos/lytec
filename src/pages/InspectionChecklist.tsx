import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { DateField } from "@/components/truck-equipment-appointment/form-fields/DateField";
import { CostCenterField } from "@/components/truck-equipment-appointment/form-fields/CostCenterField";
import { StatusField } from "@/components/truck-equipment-appointment/form-fields/StatusField";
import { TruckEquipmentField } from "@/components/truck-equipment-appointment/form-fields/TruckEquipmentField";
import { TimeFields } from "@/components/truck-equipment-appointment/form-fields/TimeFields";
import { HourmeterFields } from "@/components/truck-equipment-appointment/form-fields/HourmeterFields";
import { AdditionalFields } from "@/components/truck-equipment-appointment/form-fields/AdditionalFields";

export default function InspectionChecklist() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm();

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
    } catch (error) {
      console.error('Error saving checklist:', error);
      toast.error('Erro ao salvar checklist');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    form.reset();
  };

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Apontamento de Caminhão/Equipamentos</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <DateField form={form} />
              <CostCenterField form={form} />
              <StatusField form={form} />
              <TruckEquipmentField form={form} />
              <TimeFields form={form} />
              <HourmeterFields form={form} />
              <AdditionalFields form={form} />

              <div className="flex space-x-2">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Enviando..." : "Enviar"}
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancelar
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}