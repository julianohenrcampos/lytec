import { PermissionForm } from "@/components/permissions/PermissionForm";
import { PermissionTable } from "@/components/permissions/PermissionTable";
import { PermissionTypeTable } from "@/components/permissions/types/PermissionTypeTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
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

        <Card>
          <CardHeader>
            <CardTitle>Telas com Acesso</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li>Dashboard</li>
              <li>Gerenciamento de Funcionários</li>
              <li>Gerenciamento de Equipes</li>
              <li>Gerenciamento de Permissões</li>
              <li>Programação de Massa</li>
              <li>Requisições de Massa</li>
              <li>Apontamento de Caminhão/Equipamento</li>
              <li>Checklist</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}