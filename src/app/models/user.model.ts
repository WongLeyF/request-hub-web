export interface User {
  id?: number;
  nombre: string;
  username: string;
  apellido: string;
  email: string;
  areaId: number | null;
  departamento: string;
  cargo: string;
  rol: string; // 'admin', 'supervisor', 'user'
  estado: boolean; // activo o inactivo
  area: string;
  fechaCreacion?: Date;
  avatarUrl?: string; // URL de la imagen del avatar
}
