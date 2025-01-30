import type { UseFormReturn } from "react-hook-form";
import type { PermissionFormValues } from "./schema";
import { UserSelectField } from "./form-fields/UserSelectField";
import { PermissionLevelField } from "./form-fields/PermissionLevelField";
import { ScreenAccessField } from "./form-fields/ScreenAccessField";
import { AccessTypeField } from "./form-fields/AccessTypeField";

interface PermissionFormFieldsProps {
  form: UseFormReturn<PermissionFormValues>;
  users: { id: string; nome: string; }[] | null;
  isLoadingUsers: boolean;
}

export function PermissionFormFields({ form, users, isLoadingUsers }: PermissionFormFieldsProps) {
  return (
    <>
      <UserSelectField form={form} users={users} isLoadingUsers={isLoadingUsers} />
      <PermissionLevelField form={form} />
      <ScreenAccessField form={form} />
      <AccessTypeField form={form} />
    </>
  );
}