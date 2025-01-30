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
  return (
    <Form {...form}>
      <form className="space-y-4">
        <DateField form={form} />
        <CostCenterField form={form} />
        <StatusField form={form} />
        <TruckEquipmentField form={form} />
        <TimeFields form={form} />
        <HourmeterFields form={form} />
        <AdditionalFields form={form} />

        <Button type="button" className="w-full" onClick={onNext}>
          Avançar
        </Button>
      </form>
    </Form>
  );
}