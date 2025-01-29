import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useFormLogic } from "./hooks/useFormLogic";
import { useFormQueries } from "./hooks/useFormQueries";
import { DateField } from "./form-fields/DateField";
import { SelectFields } from "./form-fields/SelectFields";
import { InputFields } from "./form-fields/InputFields";
import { MassProgrammingFormProps } from "./types";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function MassProgrammingForm({ initialData, onSuccess }: MassProgrammingFormProps) {
  const { form, isSubmitting, onSubmit, handleDuplicate, handleNewLine } = useFormLogic(initialData, onSuccess);
  const { usinas, costCenters, encarregados, apontadores } = useFormQueries();

  const { data: streets } = useQuery({
    queryKey: ["request-streets", initialData?.requisicao_id],
    queryFn: async () => {
      if (!initialData?.requisicao_id) return [];
      const { data, error } = await supabase
        .from("bd_ruas_requisicao")
        .select("*")
        .eq("requisicao_id", initialData.requisicao_id);
      
      if (error) throw error;
      return data;
    },
    enabled: !!initialData?.requisicao_id,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card className="p-6">
          <div className="grid grid-cols-2 gap-4">
            <DateField form={form} />
            <SelectFields
              form={form}
              plants={usinas}
              costCenters={costCenters}
              managers={encarregados}
              pointers={apontadores}
            />
            <InputFields form={form} />
          </div>
        </Card>

        {streets && streets.length > 0 && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Lista de Ruas</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Logradouro</TableHead>
                  <TableHead>Bairro</TableHead>
                  <TableHead>Largura (m)</TableHead>
                  <TableHead>Comprimento (m)</TableHead>
                  <TableHead>Área (m²)</TableHead>
                  <TableHead>Espessura (m)</TableHead>
                  <TableHead>Volume (t)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {streets.map((street) => (
                  <TableRow key={street.id}>
                    <TableCell>{street.logradouro}</TableCell>
                    <TableCell>{street.bairro}</TableCell>
                    <TableCell>{street.largura}</TableCell>
                    <TableCell>{street.comprimento}</TableCell>
                    <TableCell>{street.area}</TableCell>
                    <TableCell>{street.espessura}</TableCell>
                    <TableCell>{street.peso}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}

        <div className="flex justify-between">
          <div className="space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleDuplicate}
            >
              Duplicar Linha
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleNewLine}
            >
              Nova Linha
            </Button>
          </div>
          <div className="space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                form.reset();
                onSuccess();
              }}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {initialData ? "Atualizar" : "Salvar"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}