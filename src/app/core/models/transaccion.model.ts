export interface Transaccion {
  id?: string;             
  usuarioId: string;       
  categoriaId: string;     
  tipo: 'ingreso' | 'gasto'; 
  concepto: string;        
  monto: number;           
  fecha: string;           
  notas?: string;          
  creadoEn?: string;       
  actualizadoEn?: string;  
}   