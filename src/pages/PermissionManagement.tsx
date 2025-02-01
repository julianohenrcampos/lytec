import { PermissionForm } from "@/components/permissions/PermissionForm";
import { PermissionTable } from "@/components/permissions/PermissionTable";
import { PermissionTypeTable } from "@/components/permissions/types/PermissionTypeTable";
import { useState } from "react";

export default function PermissionManagement() {
  const [showForm, setShowForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{
    id: string;
    nome: string;
    permissao_usuario: string | null;
  } | null>(null);

  const handleSuccess = () => {
    setShowForm(false);
    setSelectedUser(null);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-3xl font-bold">Gerenciamento de Permissões</h1>

      {showForm ? (
        <PermissionForm
          selectedUser={selectedUser}
          onSuccess={handleSuccess}
        />
      ) : (
        <>
          <PermissionTypeTable />
          <PermissionTable
            onEdit={(user) => {
              setSelectedUser(user);
              setShowForm(true);
            }}
          />
        </>
      )}
    </div>
  );
}