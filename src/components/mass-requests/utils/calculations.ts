import { Street } from "../types";

export function calculateStreetMetrics(street: Street) {
  const area = street.largura * street.comprimento;
  const peso = area * street.espessura * 2.4;
  return { area, peso };
}