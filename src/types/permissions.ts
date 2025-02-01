export type UserPermissionLevel = "admin" | "rh" | "transporte" | "logistica" | "planejamento" | "apontador" | "encarregado" | "engenheiro" | "balanca" | "motorista" | "operador";

export interface ScreenPermission {
  screen_name: string;
  can_access: boolean;
  can_create: boolean;
  can_edit: boolean;
  can_delete: boolean;
  created_at?: string;
  id?: string;
  permission_level?: string;
}

export type PermissionAction = 'create' | 'edit' | 'delete';

export interface UpdatePermissionParams {
  userId: string;
  newPermissionLevel: UserPermissionLevel;
  screens: string[];
}