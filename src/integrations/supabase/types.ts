export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      bd_apontamentocaminhaoequipamento: {
        Row: {
          abastecimento: number | null
          anotacoes: string | null
          caminhao_equipamento_id: string
          centro_custo_id: string
          checklist: Json
          created_at: string
          data: string
          hora_final: string
          hora_inicial: string
          horimetro_final: number
          horimetro_inicial: number
          id: string
          status: Database["public"]["Enums"]["equipment_status"]
        }
        Insert: {
          abastecimento?: number | null
          anotacoes?: string | null
          caminhao_equipamento_id: string
          centro_custo_id: string
          checklist?: Json
          created_at?: string
          data: string
          hora_final: string
          hora_inicial: string
          horimetro_final: number
          horimetro_inicial: number
          id?: string
          status: Database["public"]["Enums"]["equipment_status"]
        }
        Update: {
          abastecimento?: number | null
          anotacoes?: string | null
          caminhao_equipamento_id?: string
          centro_custo_id?: string
          checklist?: Json
          created_at?: string
          data?: string
          hora_final?: string
          hora_inicial?: string
          horimetro_final?: number
          horimetro_inicial?: number
          id?: string
          status?: Database["public"]["Enums"]["equipment_status"]
        }
        Relationships: [
          {
            foreignKeyName: "bd_apontamentocaminhaoequipamento_caminhao_equipamento_id_fkey"
            columns: ["caminhao_equipamento_id"]
            isOneToOne: false
            referencedRelation: "bd_caminhaoequipamento"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bd_apontamentocaminhaoequipamento_centro_custo_id_fkey"
            columns: ["centro_custo_id"]
            isOneToOne: false
            referencedRelation: "bd_centrocusto"
            referencedColumns: ["id"]
          },
        ]
      }
      bd_caminhaoequipamento: {
        Row: {
          aluguel: number | null
          ano: number | null
          capacidade: number | null
          created_at: string
          descricao: string | null
          frota_id: string
          id: string
          imagem: string | null
          modelo: string
          placa: string | null
          proprietario: string | null
          tipo: string
        }
        Insert: {
          aluguel?: number | null
          ano?: number | null
          capacidade?: number | null
          created_at?: string
          descricao?: string | null
          frota_id: string
          id?: string
          imagem?: string | null
          modelo: string
          placa?: string | null
          proprietario?: string | null
          tipo: string
        }
        Update: {
          aluguel?: number | null
          ano?: number | null
          capacidade?: number | null
          created_at?: string
          descricao?: string | null
          frota_id?: string
          id?: string
          imagem?: string | null
          modelo?: string
          placa?: string | null
          proprietario?: string | null
          tipo?: string
        }
        Relationships: [
          {
            foreignKeyName: "bd_caminhaoequipamento_frota_id_fkey"
            columns: ["frota_id"]
            isOneToOne: false
            referencedRelation: "bd_frota"
            referencedColumns: ["id"]
          },
        ]
      }
      bd_centrocusto: {
        Row: {
          created_at: string
          id: string
          nome: string
        }
        Insert: {
          created_at?: string
          id?: string
          nome: string
        }
        Update: {
          created_at?: string
          id?: string
          nome?: string
        }
        Relationships: []
      }
      bd_departamento: {
        Row: {
          created_at: string
          id: string
          nome: string
        }
        Insert: {
          created_at?: string
          id?: string
          nome: string
        }
        Update: {
          created_at?: string
          id?: string
          nome?: string
        }
        Relationships: []
      }
      bd_empresa_proprietaria: {
        Row: {
          cnpj: string | null
          created_at: string
          id: string
          nome: string
        }
        Insert: {
          cnpj?: string | null
          created_at?: string
          id?: string
          nome: string
        }
        Update: {
          cnpj?: string | null
          created_at?: string
          id?: string
          nome?: string
        }
        Relationships: []
      }
      bd_equipe: {
        Row: {
          apontador_id: string | null
          colaboradores: string[] | null
          created_at: string
          encarregado_id: string | null
          id: string
          nome: string
          updated_at: string | null
        }
        Insert: {
          apontador_id?: string | null
          colaboradores?: string[] | null
          created_at?: string
          encarregado_id?: string | null
          id?: string
          nome: string
          updated_at?: string | null
        }
        Update: {
          apontador_id?: string | null
          colaboradores?: string[] | null
          created_at?: string
          encarregado_id?: string | null
          id?: string
          nome?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bd_equipe_apontador_id_fkey"
            columns: ["apontador_id"]
            isOneToOne: false
            referencedRelation: "bd_rhasfalto"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bd_equipe_encarregado_id_fkey"
            columns: ["encarregado_id"]
            isOneToOne: false
            referencedRelation: "bd_rhasfalto"
            referencedColumns: ["id"]
          },
        ]
      }
      bd_frota: {
        Row: {
          created_at: string
          frota: string
          id: string
          numero: string
        }
        Insert: {
          created_at?: string
          frota: string
          id?: string
          numero: string
        }
        Update: {
          created_at?: string
          frota?: string
          id?: string
          numero?: string
        }
        Relationships: []
      }
      bd_funcao: {
        Row: {
          created_at: string
          id: string
          nome: string
        }
        Insert: {
          created_at?: string
          id?: string
          nome: string
        }
        Update: {
          created_at?: string
          id?: string
          nome?: string
        }
        Relationships: []
      }
      bd_permissoes: {
        Row: {
          acesso: boolean | null
          created_at: string
          id: string
          tela: string
          usuario_id: string | null
        }
        Insert: {
          acesso?: boolean | null
          created_at?: string
          id?: string
          tela: string
          usuario_id?: string | null
        }
        Update: {
          acesso?: boolean | null
          created_at?: string
          id?: string
          tela?: string
          usuario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bd_permissoes_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "bd_rhasfalto"
            referencedColumns: ["id"]
          },
        ]
      }
      bd_programacaomassa: {
        Row: {
          apontador: string
          caminhao: string | null
          centro_custo_id: string
          created_at: string
          data_entrega: string
          encarregado: string
          id: string
          logradouro: string
          requisicao_id: string | null
          tipo_lancamento: string
          usina: string
          volume: number | null
        }
        Insert: {
          apontador: string
          caminhao?: string | null
          centro_custo_id: string
          created_at?: string
          data_entrega: string
          encarregado: string
          id?: string
          logradouro: string
          requisicao_id?: string | null
          tipo_lancamento: string
          usina: string
          volume?: number | null
        }
        Update: {
          apontador?: string
          caminhao?: string | null
          centro_custo_id?: string
          created_at?: string
          data_entrega?: string
          encarregado?: string
          id?: string
          logradouro?: string
          requisicao_id?: string | null
          tipo_lancamento?: string
          usina?: string
          volume?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "bd_programacaomassa_apontador_fkey"
            columns: ["apontador"]
            isOneToOne: false
            referencedRelation: "bd_rhasfalto"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bd_programacaomassa_centro_custo_id_fkey"
            columns: ["centro_custo_id"]
            isOneToOne: false
            referencedRelation: "bd_centrocusto"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bd_programacaomassa_encarregado_fkey"
            columns: ["encarregado"]
            isOneToOne: false
            referencedRelation: "bd_rhasfalto"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bd_programacaomassa_requisicao_id_fkey"
            columns: ["requisicao_id"]
            isOneToOne: false
            referencedRelation: "bd_requisicao"
            referencedColumns: ["id"]
          },
        ]
      }
      bd_requisicao: {
        Row: {
          area: number | null
          bairro: string | null
          centro_custo: string
          comprimento: number
          created_at: string
          data: string
          diretoria: string | null
          engenheiro: string
          espessura: number
          gerencia: string | null
          id: string
          largura: number
          ligante: string | null
          logradouro: string
          peso: number | null
          quantidade_programada: number | null
          traco: string | null
        }
        Insert: {
          area?: number | null
          bairro?: string | null
          centro_custo: string
          comprimento: number
          created_at?: string
          data: string
          diretoria?: string | null
          engenheiro: string
          espessura: number
          gerencia?: string | null
          id?: string
          largura: number
          ligante?: string | null
          logradouro: string
          peso?: number | null
          quantidade_programada?: number | null
          traco?: string | null
        }
        Update: {
          area?: number | null
          bairro?: string | null
          centro_custo?: string
          comprimento?: number
          created_at?: string
          data?: string
          diretoria?: string | null
          engenheiro?: string
          espessura?: number
          gerencia?: string | null
          id?: string
          largura?: number
          ligante?: string | null
          logradouro?: string
          peso?: number | null
          quantidade_programada?: number | null
          traco?: string | null
        }
        Relationships: []
      }
      bd_rhasfalto: {
        Row: {
          adicional_noturno: number | null
          admissao: string
          ativo: boolean | null
          aviso: boolean | null
          centro_custo_id: string
          cpf: string
          created_at: string
          custo_passagem: number | null
          demissao: string | null
          departamento_id: string | null
          diarias: number | null
          empresa_proprietaria_id: string | null
          endereco: string | null
          equipe_id: string | null
          escolaridade: string | null
          ferias: string | null
          funcao_id: string
          genero: boolean | null
          gratificacao: number | null
          id: string
          imagem: string | null
          insalubridade: number | null
          matricula: string
          nome: string
          periculosidade: number | null
          permissao_usuario:
            | Database["public"]["Enums"]["user_permission"]
            | null
          refeicao: number | null
          salario: number
        }
        Insert: {
          adicional_noturno?: number | null
          admissao: string
          ativo?: boolean | null
          aviso?: boolean | null
          centro_custo_id: string
          cpf: string
          created_at?: string
          custo_passagem?: number | null
          demissao?: string | null
          departamento_id?: string | null
          diarias?: number | null
          empresa_proprietaria_id?: string | null
          endereco?: string | null
          equipe_id?: string | null
          escolaridade?: string | null
          ferias?: string | null
          funcao_id: string
          genero?: boolean | null
          gratificacao?: number | null
          id?: string
          imagem?: string | null
          insalubridade?: number | null
          matricula: string
          nome: string
          periculosidade?: number | null
          permissao_usuario?:
            | Database["public"]["Enums"]["user_permission"]
            | null
          refeicao?: number | null
          salario: number
        }
        Update: {
          adicional_noturno?: number | null
          admissao?: string
          ativo?: boolean | null
          aviso?: boolean | null
          centro_custo_id?: string
          cpf?: string
          created_at?: string
          custo_passagem?: number | null
          demissao?: string | null
          departamento_id?: string | null
          diarias?: number | null
          empresa_proprietaria_id?: string | null
          endereco?: string | null
          equipe_id?: string | null
          escolaridade?: string | null
          ferias?: string | null
          funcao_id?: string
          genero?: boolean | null
          gratificacao?: number | null
          id?: string
          imagem?: string | null
          insalubridade?: number | null
          matricula?: string
          nome?: string
          periculosidade?: number | null
          permissao_usuario?:
            | Database["public"]["Enums"]["user_permission"]
            | null
          refeicao?: number | null
          salario?: number
        }
        Relationships: [
          {
            foreignKeyName: "bd_rhasfalto_centro_custo_id_fkey"
            columns: ["centro_custo_id"]
            isOneToOne: false
            referencedRelation: "bd_centrocusto"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bd_rhasfalto_departamento_id_fkey"
            columns: ["departamento_id"]
            isOneToOne: false
            referencedRelation: "bd_departamento"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bd_rhasfalto_empresa_proprietaria_id_fkey"
            columns: ["empresa_proprietaria_id"]
            isOneToOne: false
            referencedRelation: "bd_empresa_proprietaria"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bd_rhasfalto_equipe_id_fkey"
            columns: ["equipe_id"]
            isOneToOne: false
            referencedRelation: "bd_equipe"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bd_rhasfalto_funcao_id_fkey"
            columns: ["funcao_id"]
            isOneToOne: false
            referencedRelation: "bd_funcao"
            referencedColumns: ["id"]
          },
        ]
      }
      bd_ruas_requisicao: {
        Row: {
          area: number | null
          bairro: string | null
          comprimento: number
          created_at: string
          espessura: number
          id: string
          largura: number
          ligante: string | null
          logradouro: string
          peso: number | null
          requisicao_id: string
          traco: string | null
        }
        Insert: {
          area?: number | null
          bairro?: string | null
          comprimento: number
          created_at?: string
          espessura: number
          id?: string
          largura: number
          ligante?: string | null
          logradouro: string
          peso?: number | null
          requisicao_id: string
          traco?: string | null
        }
        Update: {
          area?: number | null
          bairro?: string | null
          comprimento?: number
          created_at?: string
          espessura?: number
          id?: string
          largura?: number
          ligante?: string | null
          logradouro?: string
          peso?: number | null
          requisicao_id?: string
          traco?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bd_ruas_requisicao_requisicao_id_fkey"
            columns: ["requisicao_id"]
            isOneToOne: false
            referencedRelation: "bd_requisicao"
            referencedColumns: ["id"]
          },
        ]
      }
      bd_usinas: {
        Row: {
          created_at: string
          endereco: string | null
          id: string
          producao_total: number | null
          usina: string
        }
        Insert: {
          created_at?: string
          endereco?: string | null
          id?: string
          producao_total?: number | null
          usina: string
        }
        Update: {
          created_at?: string
          endereco?: string | null
          id?: string
          producao_total?: number | null
          usina?: string
        }
        Relationships: []
      }
      permission_screens: {
        Row: {
          can_access: boolean | null
          can_create: boolean | null
          can_delete: boolean | null
          can_edit: boolean | null
          created_at: string
          id: string
          permission_level: Database["public"]["Enums"]["user_permission"]
          screen_name: string
        }
        Insert: {
          can_access?: boolean | null
          can_create?: boolean | null
          can_delete?: boolean | null
          can_edit?: boolean | null
          created_at?: string
          id?: string
          permission_level: Database["public"]["Enums"]["user_permission"]
          screen_name: string
        }
        Update: {
          can_access?: boolean | null
          can_create?: boolean | null
          can_delete?: boolean | null
          can_edit?: boolean | null
          created_at?: string
          id?: string
          permission_level?: Database["public"]["Enums"]["user_permission"]
          screen_name?: string
        }
        Relationships: []
      }
      permission_types: {
        Row: {
          active: boolean
          created_at: string
          description: string | null
          id: string
          label: string
          name: string
          screens: string[] | null
        }
        Insert: {
          active?: boolean
          created_at?: string
          description?: string | null
          id?: string
          label: string
          name: string
          screens?: string[] | null
        }
        Update: {
          active?: boolean
          created_at?: string
          description?: string | null
          id?: string
          label?: string
          name?: string
          screens?: string[] | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          first_name: string | null
          id: string
          last_name: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          first_name?: string | null
          id: string
          last_name?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      checklist_status: "C" | "NC" | "NA"
      equipment_status: "Operando" | "Em Manutenção" | "Parado"
      user_permission:
        | "engenheiro"
        | "planejamento"
        | "balanca"
        | "apontador"
        | "admin"
        | "rh"
        | "transporte"
        | "logistica"
        | "motorista"
        | "operador"
        | "encarregado"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
