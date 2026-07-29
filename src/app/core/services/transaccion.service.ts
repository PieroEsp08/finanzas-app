import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Transaccion } from '../models/transaccion.model';

@Injectable({
  providedIn: 'root'
})
export class TransaccionService {
  private http = inject(HttpClient);
  
  // Sincronizado con tu @RequestMapping("/api/transacciones")
  private apiUrl = `${environment.apiUrl}/api/transacciones`;

  /**
   * Obtiene todas las transacciones de un usuario en particular
   * Mapea con: GET /api/transacciones?usuarioId=...
   */
  obtenerPorUsuario(usuarioId: string): Observable<Transaccion[]> {
    const params = new HttpParams().set('usuarioId', usuarioId);
    return this.http.get<Transaccion[]>(this.apiUrl, { params });
  }

  /**
   * Obtiene las transacciones filtradas por tipo ('ingreso' o 'gasto')
   * Mapea con: GET /api/transacciones/tipo?usuarioId=...&tipo=...
   */
  obtenerPorTipo(usuarioId: string, tipo: 'ingreso' | 'gasto'): Observable<Transaccion[]> {
    const params = new HttpParams()
      .set('usuarioId', usuarioId)
      .set('tipo', tipo);
    return this.http.get<Transaccion[]>(`${this.apiUrl}/tipo`, { params });
  }

  /**
   * Obtiene las transacciones dentro de un rango de fechas
   * Mapea con: GET /api/transacciones/rango?usuarioId=...&desde=...&hasta=...
   */
  obtenerPorRangoFechas(usuarioId: string, desde: string, hasta: string): Observable<Transaccion[]> {
    const params = new HttpParams()
      .set('usuarioId', usuarioId)
      .set('desde', desde)
      .set('hasta', hasta);
    return this.http.get<Transaccion[]>(`${this.apiUrl}/rango`, { params });
  }

  /**
   * Obtiene una sola transacción por su ID (UUID)
   * Mapea con: GET /api/transacciones/{id}
   */
  obtenerPorId(id: string): Observable<Transaccion> {
    return this.http.get<Transaccion>(`${this.apiUrl}/${id}`);
  }

  /**
   * Crea una nueva transacción (Envía tu TransaccionRequest en el body)
   * Mapea con: POST /api/transacciones
   */
  crear(transaccion: Transaccion): Observable<Transaccion> {
    return this.http.post<Transaccion>(this.apiUrl, transaccion);
  }

  /**
   * Actualiza una transacción (Envía el UUID en la ruta y el body con los cambios)
   * Mapea con: PUT /api/transacciones/{id}
   */
  actualizar(id: string, transaccion: Transaccion): Observable<Transaccion> {
    return this.http.put<Transaccion>(`${this.apiUrl}/${id}`, transaccion);
  }

  /**
   * Elimina una transacción (Tu backend retorna ResponseEntity<TransaccionResponse> al borrar)
   * Mapea con: DELETE /api/transacciones/{id}
   */
  eliminar(id: string): Observable<Transaccion> {
    return this.http.delete<Transaccion>(`${this.apiUrl}/${id}`);
  }
} 