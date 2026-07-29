import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Categoria } from '../models/categoria.model';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private http = inject(HttpClient);

  // Sincronizado con @RequestMapping("/api/categorias") de tu Spring Boot
  private apiUrl = `${environment.apiUrl}/api/categorias`;

  /**
   * Obtiene todas las categorías disponibles para un usuario (globales + personalizadas).
   * Mapea con: GET /api/categorias?usuarioId=...
   */
  obtenerPorUsuario(usuarioId: string): Observable<Categoria[]> {
    const params = new HttpParams().set('usuarioId', usuarioId);
    return this.http.get<Categoria[]>(this.apiUrl, { params });
  }

  /**
   * Obtiene las categorías filtradas por tipo ('ingreso' o 'gasto') para un usuario.
   * Mapea con: GET /api/categorias/tipo?usuarioId=...&tipo=...
   */
  obtenerPorUsuarioYTipo(usuarioId: string, tipo: 'ingreso' | 'gasto'): Observable<Categoria[]> {
    const params = new HttpParams()
      .set('usuarioId', usuarioId)
      .set('tipo', tipo);
    return this.http.get<Categoria[]>(`${this.apiUrl}/tipo`, { params });
  }

  /**
   * Obtiene una sola categoría por su ID (UUID).
   * Mapea con: GET /api/categorias/{id}
   */
  obtenerPorId(id: string): Observable<Categoria> {
    return this.http.get<Categoria>(`${this.apiUrl}/${id}`);
  }

  /**
   * Registra una nueva categoría personalizada para el usuario.
   * Mapea con: POST /api/categorias
   */
  crear(categoria: Categoria): Observable<Categoria> {
    return this.http.post<Categoria>(this.apiUrl, categoria);
  }

  /**
   * Actualiza una categoría existente.
   * Mapea con: PUT /api/categorias/{id}
   */
  actualizar(id: string, categoria: Categoria): Observable<Categoria> {
    return this.http.put<Categoria>(`${this.apiUrl}/${id}`, categoria);
  }

  /**
   * Elimina una categoría personalizada utilizando su UUID.
   * Retorna la categoría eliminada tal como lo hace tu CategoriaController de Spring Boot.
   * Mapea con: DELETE /api/categorias/{id}
   */
  eliminar(id: string): Observable<Categoria> {
    return this.http.delete<Categoria>(`${this.apiUrl}/${id}`);
  }
}