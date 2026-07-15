import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, AuthResponse, UserResponse } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey, {
      auth: {
        storage: window.localStorage,
        persistSession: true,
        autoRefreshToken: true
      }
    });
  }

  /**
   * Controla de forma nativa la sesión. Si no se desea recordar, 
   * limpia los tokens de Supabase automáticamente al cerrar la pestaña.
   */
  configurarPersistencia(recordar: boolean): void {
    if (!recordar) {
      window.addEventListener('beforeunload', this.limpiarAlmacenamientoSupabase);
    } else {
      window.removeEventListener('beforeunload', this.limpiarAlmacenamientoSupabase);
    }
  }

  private limpiarAlmacenamientoSupabase = (): void => {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('sb-')) {
        localStorage.removeItem(key);
      }
    }
  };

  async signIn(email: string, password: string): Promise<AuthResponse> {
    return await this.supabase.auth.signInWithPassword({ email, password });
  }

  async signUp(email: string, password: string, nombre: string): Promise<AuthResponse> {
    return await this.supabase.auth.signUp({
      email,
      password,
      options: { 
       
        data: { nombre: nombre } 
      }
    });
  }

  async signOut(): Promise<{ error: any }> {
    this.limpiarAlmacenamientoSupabase(); // Limpieza preventiva extra
    return await this.supabase.auth.signOut();
  }

  async getCurrentUser(): Promise<UserResponse> {
    return await this.supabase.auth.getUser();
  }

  async getSession() {
    return await this.supabase.auth.getSession();
  }

}