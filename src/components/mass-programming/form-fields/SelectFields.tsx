import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../types";

interface SelectFieldsProps {
  form: UseFormReturn<FormValues>;
  plants?: any[];
  costCenters?: any[];
  managers?: any[];
  pointers?: any[];
}

export function SelectFields({ form, plants, costCenters, managers, pointers }: SelectFieldsProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="tipo_lancamento"
        rules={{ required: "Tipo de lançamento é obrigatório" }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tipo de Lançamento</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="Acabadora">Acabadora</SelectItem>
                <SelectItem value="Manual">Manual</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="usina"
        rules={{ required: "Usina é obrigatória" }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Usina</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a usina" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {plants?.map((plant) => (
                  <SelectItem key={plant.id} value={plant.usina}>
                    {plant.usina}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="centro_custo_id"
        rules={{ required: "Centro de custo é obrigatório" }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Centro de Custo</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o centro de custo" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {costCenters?.map((cc) => (
                  <SelectItem key={cc.id} value={cc.id}>
                    {cc.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="encarregado"
        rules={{ required: "Encarregado é obrigatório" }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Encarregado</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o encarregado" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {managers?.map((manager) => (
                  <SelectItem key={manager.id} value={manager.id}>
                    {manager.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="apontador"
        rules={{ required: "Apontador é obrigatório" }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Apontador</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o apontador" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {pointers?.map((pointer) => (
                  <SelectItem key={pointer.id} value={pointer.id}>
                    {pointer.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}