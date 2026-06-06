import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  LucideAngularModule,
  ChevronDown, Check,
  Wallet, TriangleAlert, Target, CheckCircle,
  ArrowLeftRight, PieChart, Lightbulb, Megaphone
} from 'lucide-angular';

interface Notificacion {
  id: string;
  label: string;
  desc: string;
  activa: boolean;
  icono: any;
  color: string;
}

@Component({
  selector: 'app-general-tab',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './general-tab.html',
})
export class GeneralTab {

  readonly icons = { chevron: ChevronDown, check: Check };

  dropdowns: Record<string, boolean> = {
    moneda: false, idioma: false, formatoFecha: false, primerDia: false
  };

  configuracion = {
    moneda: 'PEN',
    idioma: 'es',
    formatoFecha: 'dd/mm/yyyy',
    primerDia: 'lunes'
  };

  readonly opcionesMoneda = [
    { id: 'PEN', label: 'Sol peruano' },
    { id: 'USD', label: 'Dólar estadounidense' },
    { id: 'EUR', label: 'Euro' }
  ];

  readonly opcionesIdioma = [
    { id: 'es', label: 'Español' },
    { id: 'en', label: 'English' }
  ];

  readonly opcionesFormato = [
    { id: 'dd/mm/yyyy', label: 'DD/MM/YYYY' },
    { id: 'mm/dd/yyyy', label: 'MM/DD/YYYY' }
  ];

  readonly opcionesDia = [
    { id: 'lunes', label: 'Lunes' },
    { id: 'domingo', label: 'Domingo' }
  ];

  notificaciones: Notificacion[] = [
    { id: 'presupuesto',   label: 'Alertas de presupuesto',  desc: 'Avisar cuando te acercas al límite de una categoría', activa: true,  icono: Wallet,         color: '#f59e0b' },
    { id: 'excedido',      label: 'Presupuesto excedido',     desc: 'Notificación inmediata al superar el límite',          activa: true,  icono: TriangleAlert,  color: '#ef4444' },
    { id: 'metas',         label: 'Metas de ahorro',          desc: 'Recordatorios y actualizaciones de tus metas',         activa: true,  icono: Target,         color: '#10b981' },
    { id: 'meta_cumplida', label: 'Meta cumplida',            desc: 'Celebración cuando completas una meta',                activa: true,  icono: CheckCircle,    color: '#059669' },
    { id: 'transacciones', label: 'Nuevas transacciones',     desc: 'Cada movimiento registrado en tus cuentas',            activa: false, icono: ArrowLeftRight, color: '#6b7280' },
    { id: 'reportes',      label: 'Reportes semanales',       desc: 'Resumen semanal de tus finanzas cada lunes',           activa: true,  icono: PieChart,       color: '#8b5cf6' },
    { id: 'tips',          label: 'Consejos financieros',     desc: 'Tips para mejorar tus hábitos de ahorro',              activa: false, icono: Lightbulb,      color: '#f59e0b' },
    { id: 'promo',         label: 'Promociones y novedades',  desc: 'Nuevas funciones y ofertas',                           activa: false, icono: Megaphone,      color: '#3b82f6' },
  ];

  toggleDropdown(key: string): void {
    const currentState = this.dropdowns[key];
    this.cerrarTodos();
    this.dropdowns[key] = !currentState;
  }

  cerrarTodos(): void {
    Object.keys(this.dropdowns).forEach(k => this.dropdowns[k] = false);
  }

  seleccionar(campo: keyof typeof this.configuracion, valor: string): void {
    this.configuracion[campo] = valor;
    this.cerrarTodos();
  }

  get labelMoneda() { return this.opcionesMoneda.find(o => o.id === this.configuracion.moneda)?.label; }
  get labelIdioma()  { return this.opcionesIdioma.find(o => o.id === this.configuracion.idioma)?.label; }
  get labelFormato() { return this.opcionesFormato.find(o => o.id === this.configuracion.formatoFecha)?.label; }
  get labelDia()     { return this.opcionesDia.find(o => o.id === this.configuracion.primerDia)?.label; }

  toggleNotif(notif: Notificacion): void {
    notif.activa = !notif.activa;
  }

  todasActivas(): boolean {
    return this.notificaciones.every(n => n.activa);
  }

  toggleTodas(): void {
    const activar = !this.todasActivas();
    this.notificaciones.forEach(n => n.activa = activar);
  }
}