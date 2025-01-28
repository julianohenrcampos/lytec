import { CostCenterField } from "./fields/CostCenterField";
import { DirectoryField } from "./fields/DirectoryField";
import { ManagementField } from "./fields/ManagementField";
import { EngineerField } from "./fields/EngineerField";

export function FormFields() {
  return (
    <div className="grid grid-cols-4 gap-4 mb-4 border p-4 rounded-md">
      <CostCenterField />
      <DirectoryField />
      <ManagementField />
      <EngineerField />
    </div>
  );
}