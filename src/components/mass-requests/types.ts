export interface Street {
  logradouro: string;
  bairro?: string;
  largura: number;
  comprimento: number;
  espessura: number;
  area?: number;
  peso?: number;
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
  streets?: Street[];
}

export interface FormValues {
  centro_custo: string;
  diretoria?: string;
  gerencia?: string;
  engenheiro: string;
  data: Date;
  ligante?: string;
  streets: Street[];
}