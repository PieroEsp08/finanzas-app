import { Component } from '@angular/core';

interface Presupuesto {
  categoria: string;
  icono: string;
  gastado: number;
  limite: number;
  color: string;
}

@Component({
  selector: 'app-presupuesto-categoria',
  imports: [],
  templateUrl: './presupuesto-categoria.html',
  styleUrl: './presupuesto-categoria.css',
})
export class PresupuestoCategoria {

  readonly presupuestos: Presupuesto[] = [
    { categoria: 'Alimentación',    icono: '🛒', gastado: 680,  limite: 800,  color: '#f97316' },
    { categoria: 'Transporte',      icono: '🚗', gastado: 450,  limite: 700,  color: '#06b6d4' },
    { categoria: 'Entretenimiento', icono: '🎮', gastado: 580,  limite: 400,  color: '#ec4899' },
    { categoria: 'Servicios',       icono: '⚡', gastado: 1379, limite: 2000, color: '#f59e0b' },
  ];

  getPorcentaje(p: Presupuesto): number {
    return Math.min(Math.round((p.gastado / p.limite) * 100), 100);
  }

  isExcedido(p: Presupuesto): boolean {
    return p.gastado > p.limite;
  }

  getColorBarra(p: Presupuesto): string {
    const pct = this.getPorcentaje(p);
    if (pct >= 100) return '#f43f5e';
    if (pct >= 80)  return '#f59e0b';
    return p.color;
  }
}