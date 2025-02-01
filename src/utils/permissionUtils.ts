import type { UserPermissionLevel, ScreenPermission, PermissionAction } from "@/types/permissions";

export const isAdmin = (permissionLevel: UserPermissionLevel | null): boolean => 
  permissionLevel === 'admin';

export const checkScreenAccess = (
  screenName: string,
  userPermissionLevel: UserPermissionLevel | null,
  screenPermissions: ScreenPermission[] | null
): boolean => {
  if (isAdmin(userPermissionLevel)) {
    console.log("User is admin, granting access");
    return true;
  }
  
  if (!screenPermissions) {
    console.log("No screen permissions found, denying access");
    return false;
  }
  
  const permission = screenPermissions.find(p => p.screen_name === screenName);
  console.log("Found permission:", permission);
  
  return permission?.can_access ?? false;
};

export const checkActionPermission = (
  screenName: string,
  action: PermissionAction,
  userPermissionLevel: UserPermissionLevel | null,
  screenPermissions: ScreenPermission[] | null
): boolean => {
  if (isAdmin(userPermissionLevel)) {
    return true;
  }

  if (!screenPermissions) {
    return false;
  }

  const permission = screenPermissions.find(p => p.screen_name === screenName) as ScreenPermission;
  
  switch (action) {
    case 'create':
      return permission?.can_create ?? false;
    case 'edit':
      return permission?.can_edit ?? false;
    case 'delete':
      return permission?.can_delete ?? false;
    default:
      return false;
  }
};