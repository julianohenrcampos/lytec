export interface Street {
  id?: string;
  logradouro: string;
  bairro?: string;
  largura: number;
  comprimento: number;
  espessura: number;
  area?: number;
  peso?: number;
  traco?: string;
  ligante?: string;
}

export interface MassRequest {
  id: string;
  centro_custo: string;
  diretoria?: string;
  gerencia?: string;
  engenheiro: string;
  data: string;
  logradouro: string;
  bairro?: string;
  largura: number;
  comprimento: number;
  ligante?: string;
  area: number;
  espessura: number;
  peso: number;
  traco?: string;
  streets?: Street[];
  created_at?: string;
  quantidade_programada?: number;
}

export interface FormValues {
  centro_custo: string;
  diretoria?: string;
  gerencia?: string;
  engenheiro: string;
  data: Date;
  ligante?: string;
  traco?: string;
  streets: Street[];
}