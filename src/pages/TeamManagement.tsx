import React from "react";
import { TeamFormDialog } from "@/components/teams/TeamFormDialog";
import { TeamTable } from "@/components/teams/TeamTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TeamManagement = () => {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Gerenciamento de Equipes</CardTitle>
          <TeamFormDialog />
        </CardHeader>
        <CardContent>
          <TeamTable />
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamManagement;