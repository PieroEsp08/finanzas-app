import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'undo' | 'loading';

export interface ToastData {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number; // Tiempo en milisegundos (0 = persistente)
  onUndo?: () => void;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  // Estado reactivo global con Signals
  readonly toasts = signal<ToastData[]>([]);

  /**
   * Muestra un toast genérico según los parámetros enviados.
   */
  show(toast: Omit<ToastData, 'id'>): string {
    const id = Math.random().toString(36).substring(2, 9);
    
    // Si es error dura 0 (persistente hasta cerrar), si no, usa la duración enviada o 4000ms por defecto
    const duration = toast.duration ?? (toast.type === 'error' ? 0 : 4000);

    const newToast: ToastData = {
      ...toast,
      id,
      duration,
    };

    this.toasts.update((current) => [...current, newToast]);

    // Auto-dismiss si tiene duración especificada
    if (duration > 0) {
      setTimeout(() => this.remove(id), duration);
    }

    return id;
  }

  /**
   * Helper para toast de éxito (p. ej. Registro / Creación / Edición)
   */
  success(title: string, message?: string, duration = 4000): string {
    return this.show({ type: 'success', title, message, duration });
  }

  /**
   * Helper para toast de error (Persistente por defecto)
   */
  error(title: string, message?: string): string {
    return this.show({ type: 'error', title, message, duration: 0 });
  }

  /**
   * Helper para acción reversible / Snackbar (p. ej. Al eliminar un registro)
   */
  showUndo(title: string, message: string, onUndo: () => void, duration = 6000): string {
    return this.show({
      type: 'undo',
      title,
      message,
      duration,
      onUndo,
    });
  }

  /**
   * Helper para estado de carga / procesos asíncronos
   */
  loading(title: string, message?: string): string {
    return this.show({ type: 'loading', title, message, duration: 0 });
  }

  /**
   * Elimina un toast por su ID
   */
  remove(id: string): void {
    this.toasts.update((current) => current.filter((t) => t.id !== id));
  }

  /**
   * Limpia todos los toasts activos
   */
  clear(): void {
    this.toasts.set([]);
  }
}