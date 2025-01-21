import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FleetFormDialog } from "@/components/fleet/FleetFormDialog";
import { FleetTable } from "@/components/fleet/FleetTable";
import type { Database } from "@/integrations/supabase/types";

type Fleet = Database["public"]["Tables"]["bd_frota"]["Row"];

export default function FleetManagement() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Frotas Cadastradas</CardTitle>
          <FleetFormDialog />
        </CardHeader>
        <CardContent>
          <FleetTable />
        </CardContent>
      </Card>
    </div>
  );
}