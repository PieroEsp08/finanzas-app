import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  LucideAngularModule,
  Leaf, Mail, Lock, Eye, EyeOff,
  User, PieChart, Target, ShieldCheck, Check
} from 'lucide-angular';

@Component({
  selector: 'app-login-page',
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
})
export class LoginPage {

  modo: 'login' | 'registro' = 'login';

  loginEmail = '';
  loginPassword = '';

  registroNombre = '';
  registroEmail = '';
  registroPassword = '';
  registroPassword2 = '';
  terminosAceptados = false;

  verPassword = false;
  verPassword2 = false;
  cargando = false;
  fortaleza = 0;
  fortalezaLabel = '';
  fortalezaColor = '';

  errores: Record<string, string> = {};

  icons = {
    logo: Leaf,
    mail: Mail,
    lock: Lock,
    eye: Eye,
    eyeOff: EyeOff,
    user: User,
    chart: PieChart,
    target: Target,
    shield: ShieldCheck,
    check: Check,
  };

  constructor(private router: Router) {}

  setModo(modo: 'login' | 'registro'): void {
    this.modo = modo;
    this.errores = {};
    this.fortaleza = 0;
    this.fortalezaLabel = '';
  }

  validarEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  calcularFortaleza(): void {
    const p = this.registroPassword;
    let s = 0;
    if (p.length >= 8) s++;
    if (p.length >= 12) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;

    const niveles = [
      { w: 0,   c: 'transparent', t: '' },
      { w: 20,  c: '#ef4444',     t: 'Muy débil' },
      { w: 40,  c: '#f97316',     t: 'Débil' },
      { w: 60,  c: '#f59e0b',     t: 'Regular' },
      { w: 80,  c: '#10b981',     t: 'Fuerte' },
      { w: 100, c: '#059669',     t: 'Muy fuerte' },
    ];
    this.fortaleza = niveles[s].w;
    this.fortalezaLabel = niveles[s].t;
    this.fortalezaColor = niveles[s].c;
  }

  iniciarSesion(): void {
    this.errores = {};
    let ok = true;

    if (!this.loginEmail) {
      this.errores['email'] = 'Ingresa tu correo electrónico'; ok = false;
    } else if (!this.validarEmail(this.loginEmail)) {
      this.errores['email'] = 'El formato del correo no es válido'; ok = false;
    }
    if (!this.loginPassword) {
      this.errores['password'] = 'Ingresa tu contraseña'; ok = false;
    } else if (this.loginPassword.length < 6) {
      this.errores['password'] = 'Mínimo 6 caracteres'; ok = false;
    }
    if (!ok) return;

    this.cargando = true;
    setTimeout(() => {
      this.cargando = false;
      this.router.navigate(['/dashboard']);
    }, 1400);
  }

  crearCuenta(): void {
    this.errores = {};
    let ok = true;

    if (!this.registroNombre) {
      this.errores['nombre'] = 'Ingresa tu nombre completo'; ok = false;
    } else if (this.registroNombre.length < 3) {
      this.errores['nombre'] = 'Mínimo 3 caracteres'; ok = false;
    }
    if (!this.registroEmail) {
      this.errores['email'] = 'Ingresa tu correo electrónico'; ok = false;
    } else if (!this.validarEmail(this.registroEmail)) {
      this.errores['email'] = 'Formato de correo no válido'; ok = false;
    }
    if (!this.registroPassword) {
      this.errores['password'] = 'Crea una contraseña'; ok = false;
    } else if (this.registroPassword.length < 8) {
      this.errores['password'] = 'Mínimo 8 caracteres'; ok = false;
    }
    if (!this.registroPassword2) {
      this.errores['password2'] = 'Confirma tu contraseña'; ok = false;
    } else if (this.registroPassword !== this.registroPassword2) {
      this.errores['password2'] = 'Las contraseñas no coinciden'; ok = false;
    }
    if (!this.terminosAceptados) {
      this.errores['terminos'] = 'Debes aceptar los términos'; ok = false;
    }
    if (!ok) return;

    this.cargando = true;
    setTimeout(() => {
      this.cargando = false;
      this.router.navigate(['/dashboard']);
    }, 1600);
  }
}