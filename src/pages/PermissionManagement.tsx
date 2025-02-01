import { PermissionForm } from "@/components/permissions/PermissionForm";
import { PermissionTable } from "@/components/permissions/PermissionTable";
import { PermissionTypeTable } from "@/components/permissions/types/PermissionTypeTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import type { UserPermissionLevel } from "@/types/permissions";

export default function PermissionManagement() {
  const [showPermissionForm, setShowPermissionForm] = useState(false);
  const [showTypeForm, setShowTypeForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{
    id: string;
    nome: string;
    permissao_usuario: UserPermissionLevel | null;
  } | null>(null);

  const handleSuccess = () => {
    setShowPermissionForm(false);
    setShowTypeForm(false);
    setSelectedUser(null);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gerenciamento de Permissões</h1>
        <div className="flex gap-2">
          <Button onClick={() => setShowTypeForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Tipo
          </Button>
          <Button onClick={() => setShowPermissionForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nova Permissão
          </Button>
        </div>
      </div>

      {showPermissionForm ? (
        <PermissionForm
          selectedUser={selectedUser}
          onSuccess={handleSuccess}
          onCancel={() => {
            setShowPermissionForm(false);
            setSelectedUser(null);
          }}
        />
      ) : (
        <>
          <PermissionTypeTable
            showForm={showTypeForm}
            onCloseForm={() => setShowTypeForm(false)}
          />
          <PermissionTable 
            permissions={[]}
            onEdit={(user) => {
              setSelectedUser(user);
              setShowPermissionForm(true);
            }}
          />
        </>
      )}
    </div>
  );
}