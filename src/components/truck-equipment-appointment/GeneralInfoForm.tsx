import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { DateField } from "./form-fields/DateField";
import { CostCenterField } from "./form-fields/CostCenterField";
import { StatusField } from "./form-fields/StatusField";
import { TruckEquipmentField } from "./form-fields/TruckEquipmentField";
import { TimeFields } from "./form-fields/TimeFields";
import { HourmeterFields } from "./form-fields/HourmeterFields";
import { AdditionalFields } from "./form-fields/AdditionalFields";

interface GeneralInfoFormProps {
  form: UseFormReturn<any>;
  onNext: () => void;
}

export function GeneralInfoForm({ form, onNext }: GeneralInfoFormProps) {
  const canProceed = () => {
    const values = form.getValues();
    return (
      values.data &&
      values.centro_custo_id &&
      values.caminhao_equipamento_id &&
      values.hora_inicial &&
      values.horimetro_inicial
    );
  };

  const handleNext = () => {
    if (canProceed()) {
      onNext();
    } else {
      form.trigger([
        "data",
        "centro_custo_id",
        "caminhao_equipamento_id",
        "hora_inicial",
        "horimetro_inicial",
      ]);
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <DateField form={form} />
            <CostCenterField form={form} />
            <StatusField form={form} />
            <TimeFields form={form} />
          </div>
          <div className="space-y-4">
            <TruckEquipmentField form={form} />
            <HourmeterFields form={form} />
            <AdditionalFields form={form} />
          </div>
        </div>
        <div className="flex justify-end">
          <Button type="button" className="w-full md:w-auto" onClick={handleNext}>
            Avançar
          </Button>
        </div>
      </form>
    </Form>
  );
}