export interface Categoria {
  id?: string;             
  usuarioId?: string;      
  nombre: string;          
  tipo: 'ingreso' | 'gasto'; 
  emoji?: string;          
  color: string;          
  esDefault: boolean;      
  creadoEn?: string;       
  actualizadoEn?: string;
}