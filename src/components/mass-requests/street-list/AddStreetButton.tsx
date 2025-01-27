import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface AddStreetButtonProps {
  onClick: () => void;
}

export function AddStreetButton({ onClick }: AddStreetButtonProps) {
  return (
    <Button type="button" variant="outline" onClick={onClick}>
      <Plus className="mr-2 h-4 w-4" />
      Adicionar Rua
    </Button>
  );
}