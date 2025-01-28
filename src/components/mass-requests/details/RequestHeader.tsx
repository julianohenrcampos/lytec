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
    <div className="flex flex-wrap gap-12 px-16 justify-start">
      <div className="flex flex-col">
        <h3 className="font-semibold text-sm text-gray-500 mb-1">Data</h3>
        <p className="text-base">{format(new Date(data), "dd/MM/yyyy")}</p>
      </div>
      <div className="flex flex-col">
        <h3 className="font-semibold text-sm text-gray-500 mb-1">Centro de Custo</h3>
        <p className="text-base">{centro_custo}</p>
      </div>
      <div className="flex flex-col">
        <h3 className="font-semibold text-sm text-gray-500 mb-1">Diretoria</h3>
        <p className="text-base">{diretoria || "-"}</p>
      </div>
      <div className="flex flex-col">
        <h3 className="font-semibold text-sm text-gray-500 mb-1">Gerência</h3>
        <p className="text-base">{gerencia || "-"}</p>
      </div>
      <div className="flex flex-col">
        <h3 className="font-semibold text-sm text-gray-500 mb-1">Engenheiro</h3>
        <p className="text-base">{engenheiro}</p>
      </div>
    </div>
  );
}