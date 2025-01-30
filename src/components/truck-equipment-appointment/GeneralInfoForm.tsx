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
      form.trigger(["data", "centro_custo_id", "caminhao_equipamento_id", "hora_inicial", "horimetro_inicial"]);
    }
  };

  return (
    <Form {...form}>
      <form className="grid grid-cols-2 gap-4">
        <div className="col-span-2 md:col-span-1">
          <DateField form={form} />
          <CostCenterField form={form} />
          <StatusField form={form} />
        </div>
        <div className="col-span-2 md:col-span-1">
          <TruckEquipmentField form={form} />
          <TimeFields form={form} />
          <HourmeterFields form={form} />
        </div>
        <div className="col-span-2">
          <AdditionalFields form={form} />
        </div>
        <div className="col-span-2">
          <Button type="button" className="w-full" onClick={handleNext}>
            Avançar
          </Button>
        </div>
      </form>
    </Form>
  );
}