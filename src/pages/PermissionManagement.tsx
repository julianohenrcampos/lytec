import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PermissionForm } from "@/components/permissions/PermissionForm";
import { PermissionTable } from "@/components/permissions/PermissionTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import type { UserPermissionLevel } from "@/types/permissions";

interface User {
  id: string;
  nome: string;
  permissao_usuario: UserPermissionLevel | null;
}

export default function PermissionManagement() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const { data: users, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bd_rhasfalto")
        .select("id, nome, permissao_usuario")
        .order("nome");

      if (error) {
        console.error("Error fetching users:", error);
        toast({
          title: "Erro",
          description: "Erro ao carregar usuários",
          variant: "destructive",
        });
        throw error;
      }
      
      return data as User[];
    },
  });

  const handleEditPermissions = (user: User) => {
    setSelectedUser(user);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setSelectedUser(null);
    setIsDialogOpen(false);
  };

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Gerenciamento de Permissões</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>Adicionar Permissão</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {selectedUser ? `Editar Permissões - ${selectedUser.nome}` : "Nova Permissão"}
                </DialogTitle>
              </DialogHeader>
              <PermissionForm 
                selectedUser={selectedUser}
                onSuccess={handleDialogClose}
              />
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50 text-sm">
                  <th className="p-4 text-left font-medium">Usuário</th>
                  <th className="p-4 text-left font-medium">Nível de Permissão</th>
                  <th className="p-4 text-left font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {users?.map((user) => (
                  <tr key={user.id} className="border-b">
                    <td className="p-4">{user.nome}</td>
                    <td className="p-4">{user.permissao_usuario || "Não definido"}</td>
                    <td className="p-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditPermissions(user)}
                      >
                        Editar Permissões
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}