export const validateEscolaridade = (value: string | null): "Fundamental" | "Médio" | "Técnico" | "Superior" => {
  const validValues = ["Fundamental", "Médio", "Técnico", "Superior"];
  if (value && validValues.includes(value)) {
    return value as "Fundamental" | "Médio" | "Técnico" | "Superior";
  }
  return "Médio";
};