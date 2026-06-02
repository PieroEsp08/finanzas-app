import { Component, Input, AfterViewInit, Output, EventEmitter, ChangeDetectorRef, signal } from '@angular/core';
import { LucideAngularModule, Trash2, AlertTriangle, AlertCircle, CheckCircle, Pencil } from 'lucide-angular';
import { CommonModule } from '@angular/common';

export interface Presupuesto {
  nombre: string;
  icono: string;
  color: string;
  gastado: number;
  limite: number;
}

@Component({
  selector: 'app-card-presupuesto',
  imports: [LucideAngularModule, CommonModule],
  templateUrl: './card-presupuesto.html',
  styleUrl: './card-presupuesto.css',
})
export class CardPresupuesto implements AfterViewInit {

  @Input() presupuesto!: Presupuesto;
  @Output() eliminar = new EventEmitter<void>();
  @Output() editar = new EventEmitter<void>();

  porcentajeAnimado = signal(0);

  icons = {
    trash: Trash2,
    alerta: AlertTriangle,
    limite: AlertCircle,
    normal: CheckCircle,
    edit: Pencil,
  };

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    const target = this.getPorcentaje();
    let current = 0;
    const step = target / 30;

    const interval = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(interval);
      }
      this.porcentajeAnimado.set(Math.round(current));
      this.cdr.detectChanges();
    }, 20);
  }

  getPorcentaje(): number {
    return Math.min(Math.round((this.presupuesto.gastado / this.presupuesto.limite) * 100), 100);
  }

  getRestante(): number {
    return Math.max(this.presupuesto.limite - this.presupuesto.gastado, 0);
  }

  getEstado(): 'normal' | 'riesgo' | 'limite' {
    const p = this.getPorcentaje();
    if (p >= 95) return 'limite';
    if (p >= 80) return 'riesgo';
    return 'normal';
  }

  getColorBarra(): string {
    return this.presupuesto.color;
  }

  getColorFondo(): string {
    return this.presupuesto.color + '10';
  }
}