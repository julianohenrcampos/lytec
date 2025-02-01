import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { UserPermissionLevel } from "@/types/permissions";

interface Permission {
  id: string;
  usuario_id: string;
  tela: string;
  acesso: boolean;
  usuario?: {
    nome: string;
    permissao_usuario: UserPermissionLevel;
  };
}

interface PermissionTableProps {
  permissions: Permission[];
  onEdit?: (user: { id: string; nome: string; permissao_usuario: UserPermissionLevel }) => void;
}

export function PermissionTable({ permissions, onEdit }: PermissionTableProps) {
  const formatPermissionLevel = (level: UserPermissionLevel) => {
    const levels = {
      admin: "Administrador",
      rh: "RH",
      transporte: "Transporte",
      logistica: "Logística",
      motorista: "Motorista",
      operador: "Operador",
      apontador: "Apontador",
      encarregado: "Encarregado"
    };
    return levels[level] || level;
  };

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Usuário</TableHead>
            <TableHead>Nível de Permissão</TableHead>
            <TableHead>Tela</TableHead>
            <TableHead>Acesso</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {permissions.map((permission) => (
            <TableRow key={permission.id}>
              <TableCell>{permission.usuario?.nome || "Usuário não encontrado"}</TableCell>
              <TableCell>{permission.usuario?.permissao_usuario ? formatPermissionLevel(permission.usuario.permissao_usuario) : "Não definido"}</TableCell>
              <TableCell className="capitalize">{permission.tela}</TableCell>
              <TableCell>{permission.acesso ? "Permitido" : "Negado"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}