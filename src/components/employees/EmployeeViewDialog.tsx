import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EmployeeWithRelations } from "./types";
import { Button } from "@/components/ui/button";

interface EmployeeViewDialogProps {
  employee: Partial<EmployeeWithRelations> | undefined;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EmployeeViewDialog: React.FC<EmployeeViewDialogProps> = ({
  employee,
  open,
  onOpenChange,
}) => {
  if (!employee) return null;

  const formatCurrency = (value: number | null | undefined) => {
    if (!value) return "-";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>Detalhes do Funcionário</DialogTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              // Navigate to permissions management with this employee
              window.location.href = `/permissions?employee=${employee.id}`;
            }}
          >
            Ver Permissões
          </Button>
        </DialogHeader>

        <div className="space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informações Pessoais</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-2 flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={employee.imagem} alt={employee.nome} />
                  <AvatarFallback>{employee.nome?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">{employee.nome}</h3>
                  <p className="text-gray-500">Matrícula: {employee.matricula}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">CPF</p>
                <p>{employee.cpf}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Endereço</p>
                <p>{employee.endereco || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Escolaridade</p>
                <p>{employee.escolaridade}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Gênero</p>
                <p>{employee.genero ? "Masculino" : "Feminino"}</p>
              </div>
            </CardContent>
          </Card>

          {/* Professional Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informações Profissionais</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Função</p>
                <p>{employee.funcao?.nome || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Centro de Custo</p>
                <p>{employee.centro_custo?.nome || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Empresa Proprietária</p>
                <p>{employee.empresa_proprietaria?.nome || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Equipe</p>
                <p>{employee.equipe?.nome || "-"}</p>
              </div>
            </CardContent>
          </Card>

          {/* Financial Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informações Financeiras</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Salário</p>
                <p>{formatCurrency(employee.salario)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Insalubridade</p>
                <p>{formatCurrency(employee.insalubridade)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Periculosidade</p>
                <p>{formatCurrency(employee.periculosidade)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Gratificação</p>
                <p>{formatCurrency(employee.gratificacao)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Adicional Noturno</p>
                <p>{formatCurrency(employee.adicional_noturno)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Custo Passagem</p>
                <p>{formatCurrency(employee.custo_passagem)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Refeição</p>
                <p>{formatCurrency(employee.refeicao)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Diárias</p>
                <p>{formatCurrency(employee.diarias)}</p>
              </div>
            </CardContent>
          </Card>

          {/* Contract Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informações Contratuais</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Data de Admissão</p>
                <p>
                  {employee.admissao
                    ? format(new Date(employee.admissao), "dd/MM/yyyy")
                    : "-"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Data de Férias</p>
                <p>
                  {employee.ferias
                    ? format(new Date(employee.ferias), "dd/MM/yyyy")
                    : "-"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Data de Demissão</p>
                <p>
                  {employee.demissao
                    ? format(new Date(employee.demissao), "dd/MM/yyyy")
                    : "-"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p>{employee.ativo ? "Ativo" : "Inativo"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Aviso Prévio</p>
                <p>{employee.aviso ? "Sim" : "Não"}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
