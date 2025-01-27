import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function StreetTableHeader() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="py-3">
          <div className="flex items-center gap-2">
            <span className="font-medium">Logradouro:</span>
          </div>
        </CardHeader>
        <CardContent className="py-2">
          <div className="font-medium mb-2">Dimensões:</div>
        </CardContent>
      </Card>
    </div>
  );
}