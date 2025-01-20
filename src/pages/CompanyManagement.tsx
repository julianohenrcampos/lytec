import React, { useState } from "react";
import { CompanyForm } from "@/components/companies/CompanyForm";
import { CompanyTable } from "@/components/companies/CompanyTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Company {
  id: string;
  nome: string;
  cnpj: string | null;
}

const CompanyManagement = () => {
  const [selectedCompany, setSelectedCompany] = useState<Company | undefined>();

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {selectedCompany ? "Editar Empresa" : "Cadastro de Empresa"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CompanyForm
            initialData={selectedCompany}
            onSuccess={() => setSelectedCompany(undefined)}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Empresas</CardTitle>
        </CardHeader>
        <CardContent>
          <CompanyTable onEdit={setSelectedCompany} />
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanyManagement;