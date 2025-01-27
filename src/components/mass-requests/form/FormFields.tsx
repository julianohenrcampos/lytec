import { CostCenterField } from "./fields/CostCenterField";
import { DirectoryField } from "./fields/DirectoryField";
import { ManagementField } from "./fields/ManagementField";
import { EngineerField } from "./fields/EngineerField";
import { DateField } from "./fields/DateField";
import { BinderField } from "./fields/BinderField";

export function FormFields() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <CostCenterField />
      <DirectoryField />
      <ManagementField />
      <EngineerField />
      <DateField />
      <BinderField />
    </div>
  );
}