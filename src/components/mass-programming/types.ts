export interface FormValues {
  data_entrega: Date;
  tipo_lancamento: string;
  usina: string;
  centro_custo_id: string;
  logradouro: string;
  encarregado: string;
  apontador: string;
  caminhao?: string;
  volume?: number;
}

export interface SupabaseValues {
  data_entrega: string;
  tipo_lancamento: string;
  usina: string;
  centro_custo_id: string;
  logradouro: string;
  encarregado: string;
  apontador: string;
  caminhao?: string;
  volume?: number;
  requisicao_id?: string;
}

export interface MassProgrammingFormProps {
  initialData?: any;
  onSuccess: () => void;
}