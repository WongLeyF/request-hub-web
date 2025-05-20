export interface RequestType {
  id?: number;
  nombre: string;
  descripcion: string;
  activo: boolean;
  stages?: ApprovalStage[];
}

export interface ApprovalStage {
  id?: number;
  request_type_id?: number;
  rol: string;
  area_id: number;
  etapa: number;
}

export interface Area {
  id: number;
  nombre: string;
  descripcion?: string;
}
