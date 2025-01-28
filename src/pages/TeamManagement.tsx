import { useState } from "react";
import { TeamFormDialog } from "@/components/teams/TeamFormDialog";
import { TeamTable } from "@/components/teams/TeamTable";
import { TeamFilters } from "@/components/teams/TeamFilters";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TeamManagement = () => {
  const [filters, setFilters] = useState({
    teamName: "",
  });

  const [selectedTeam, setSelectedTeam] = useState<any>(null);

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Gerenciamento de Equipes</CardTitle>
          <TeamFormDialog
            team={selectedTeam}
            onClose={() => setSelectedTeam(null)}
          />
        </CardHeader>
        <CardContent className="space-y-4">
          <TeamFilters
            filters={filters}
            onFilterChange={setFilters}
          />
          <TeamTable
            filters={filters}
            onEdit={setSelectedTeam}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamManagement;