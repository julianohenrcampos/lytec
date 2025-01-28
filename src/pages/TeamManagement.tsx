import { useState } from "react";
import { TeamFormDialog } from "@/components/teams/TeamFormDialog";
import { TeamTable } from "@/components/teams/TeamTable";
import { TeamFilters } from "@/components/teams/TeamFilters";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const TeamManagement = () => {
  const [filters, setFilters] = useState({
    teamName: "",
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<any>(null);

  const handleEdit = (team: any) => {
    setEditingTeam(team);
    setIsDialogOpen(true);
  };

  const handleClose = () => {
    setIsDialogOpen(false);
    setEditingTeam(null);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Gerenciamento de Equipes</CardTitle>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Equipe
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <TeamFilters
            filters={filters}
            onFilterChange={setFilters}
          />
          <TeamTable
            filters={filters}
            onEdit={handleEdit}
          />
        </CardContent>
      </Card>
      <TeamFormDialog
        isOpen={isDialogOpen}
        onClose={handleClose}
        editingTeam={editingTeam}
      />
    </div>
  );
};

export default TeamManagement;