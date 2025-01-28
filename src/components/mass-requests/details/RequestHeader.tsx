import { format } from "date-fns";

interface RequestHeaderProps {
  data: string;
  centro_custo: string;
  diretoria?: string;
  gerencia?: string;
  engenheiro: string;
}

export function RequestHeader({ data, centro_custo, diretoria, gerencia, engenheiro }: RequestHeaderProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">Cabeçalho da Requisição</h3>
      <div className="flex flex-wrap gap-12 px-4">
        <div className="flex flex-col">
          <h3 className="font-semibold text-sm text-gray-500 mb-1 px-3">Data</h3>
          <p className="text-base px-3">{format(new Date(data), "dd/MM/yyyy")}</p>
        </div>
        <div className="flex flex-col">
          <h3 className="font-semibold text-sm text-gray-500 mb-1 px-3">Centro de Custo</h3>
          <p className="text-base px-3">{centro_custo}</p>
        </div>
        <div className="flex flex-col">
          <h3 className="font-semibold text-sm text-gray-500 mb-1 px-3">Diretoria</h3>
          <p className="text-base px-3">{diretoria || "-"}</p>
        </div>
        <div className="flex flex-col">
          <h3 className="font-semibold text-sm text-gray-500 mb-1 px-3">Gerência</h3>
          <p className="text-base px-3">{gerencia || "-"}</p>
        </div>
        <div className="flex flex-col">
          <h3 className="font-semibold text-sm text-gray-500 mb-1 px-3">Engenheiro</h3>
          <p className="text-base px-3">{engenheiro}</p>
        </div>
      </div>
    </div>
  );
}