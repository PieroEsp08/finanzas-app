import { Component, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Leaf, BarChart2, Target, Shield, Mail, Lock, Eye, EyeOff, User, Check } from 'lucide-angular';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login-page',
  imports: [FormsModule, CommonModule, LucideAngularModule],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
  encapsulation: ViewEncapsulation.None
})
export class LoginPage {

  icons = {
    logo: Leaf, chart: BarChart2, target: Target, shield: Shield,
    mail: Mail, lock: Lock, eye: Eye, eyeOff: EyeOff, user: User, check: Check
  };

  modo: 'login' | 'registro' = 'login';
  cargando = false;

  loginEmail = '';
  loginPassword = '';
  recordarme = false;
  verPassword = false;

  registroNombre = '';
  registroEmail = '';
  registroPassword = '';
  registroPassword2 = '';
  verPassword2 = false;
  terminosAceptados = false;

  errores: Record<string, string> = {};

  fortaleza = 0;
  fortalezaColor = '';
  fortalezaLabel = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}


  setModo(modo: 'login' | 'registro'): void {
    this.modo = modo;
    this.errores = {};
  }

  async iniciarSesion(): Promise<void> {
    this.errores = {};

    if (!this.loginEmail) {
      this.errores['email'] = 'El correo es requerido';
      return;
    }
    if (!this.loginPassword) {
      this.errores['password'] = 'La contraseña es requerida';
      return;
    }

    this.cargando = true;
    this.cdr.detectChanges();

    const { error } = await this.authService.signIn(this.loginEmail, this.loginPassword);

    this.cargando = false;
    this.cdr.detectChanges();

    if (error) {
      this.errores['general'] = 'Correo o contraseña incorrectos';
      this.cdr.detectChanges();
      return;
    }

    this.authService.configurarPersistencia(this.recordarme);
    this.router.navigate(['/dashboard']);
  }

  async crearCuenta(): Promise<void> {
    this.errores = {};

    if (!this.registroNombre) {
      this.errores['nombre'] = 'El nombre es requerido';
      return;
    }
    if (!this.registroEmail) {
      this.errores['email'] = 'El correo es requerido';
      return;
    }
    if (!this.registroPassword || this.registroPassword.length < 6) {
      this.errores['password'] = 'La contraseña debe tener al menos 6 caracteres';
      return;
    }
    if (this.registroPassword !== this.registroPassword2) {
      this.errores['password2'] = 'Las contraseñas no coinciden';
      return;
    }
    if (!this.terminosAceptados) {
      this.errores['terminos'] = 'Debes aceptar los términos de servicio';
      return;
    }

    this.cargando = true;
    this.cdr.detectChanges();

    const { error } = await this.authService.signUp(
      this.registroEmail,
      this.registroPassword,
      this.registroNombre
    );

    this.cargando = false;
    this.cdr.detectChanges();

    if (error) {
    // Convertimos el mensaje a minúsculas para evaluar variaciones de Supabase/Firebase/Custom
    const mensajeError = error.message?.toLowerCase() || '';

    if (mensajeError.includes('already registered') || mensajeError.includes('already exists') || error.status === 422) {
      this.errores['email'] = 'Este correo ya está registrado';
    } else if (mensajeError.includes('invalid email') || mensajeError.includes('format')) {
      this.errores['email'] = 'El formato del correo electrónico no es válido';
    } else {
      // Un fallback genérico por si falla la conexión o hay otro inconveniente
      this.errores['email'] = 'Hubo un error al registrar la cuenta. Inténtalo de nuevo.';
    }

    this.cdr.detectChanges();
    return;
  }

    this.registroExitoso = true;
    this.cdr.detectChanges();
  }

  calcularFortaleza(): void {
    const p = this.registroPassword;

    // Si el campo está vacío, reiniciamos todo a cero y salimos de la función
    if (!p) {
      this.fortaleza = 0;
      this.fortalezaColor = 'transparent'; // O el color de fondo por defecto de tu barra vacía
      this.fortalezaLabel = '';
      return;
    }

    let puntos = 0;

    if (p.length >= 6)  puntos++;
    if (p.length >= 10) puntos++;
    if (/[A-Z]/.test(p)) puntos++;
    if (/[0-9]/.test(p)) puntos++;
    if (/[^A-Za-z0-9]/.test(p)) puntos++;

    this.fortaleza = (puntos / 5) * 100;

    if (puntos <= 2) {
      this.fortalezaColor = '#ef4444';
      this.fortalezaLabel = 'Débil';
    } else if (puntos <= 3) {
      this.fortalezaColor = '#f59e0b';
      this.fortalezaLabel = 'Regular';
    } else {
      this.fortalezaColor = '#10b981';
      this.fortalezaLabel = 'Fuerte';
    }
  }

  registroExitoso = false;

  irAlLogin(): void {
  // 1. Ocultamos el modal de éxito
  this.registroExitoso = false;

  // 2. Limpiamos todas las cajas de texto del formulario
  this.registroNombre = '';
  this.registroEmail = '';
  this.registroPassword = '';
  this.registroPassword2 = '';
  this.terminosAceptados = false;

  this.calcularFortaleza();

  // 3. Limpiamos el historial de errores previos
  this.errores = {};

  // 4. Cambiamos a la pantalla de inicio de sesión
  this.modo = 'login';

  // 5. Notificamos a Angular el cambio de estado de las variables
  this.cdr.detectChanges();
}
}