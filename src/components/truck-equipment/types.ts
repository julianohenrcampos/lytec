export interface TruckEquipment {
  id: string;
  frota_id: string;
  tipo: 'Caminhão' | 'Equipamento';
  modelo: string;
  placa?: string;
  ano?: number;
  capacidade?: number;
  proprietario?: string;
  descricao?: string;
  created_at: string;
  frota?: {
    frota: string;
    numero: string;
  };
}