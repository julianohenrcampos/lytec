import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChecklistForm } from "@/components/truck-equipment-appointment/ChecklistForm";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export default function InspectionChecklist() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm();

  const handleSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      
      const { error } = await supabase
        .from('bd_apontamentocaminhaoequipamento')
        .insert([{
          checklist: data.checklist,
          data: new Date().toISOString().split('T')[0],
          status: 'pendente',
          // These fields are required by the table schema, we'll need to add proper form fields for them later
          centro_custo_id: '00000000-0000-0000-0000-000000000000', // Placeholder
          caminhao_equipamento_id: '00000000-0000-0000-0000-000000000000', // Placeholder
          hora_inicial: '00:00',
          hora_final: '00:00',
          horimetro_inicial: 0,
          horimetro_final: 0,
        }]);

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

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Checklist de Inspeção</CardTitle>
        </CardHeader>
        <CardContent>
          <ChecklistForm 
            form={form} 
            onSubmit={handleSubmit}
            onBack={() => window.history.back()}
          />
        </CardContent>
      </Card>
    </div>
  );
}