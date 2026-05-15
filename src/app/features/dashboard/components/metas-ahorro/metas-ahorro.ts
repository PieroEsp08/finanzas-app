import { Component } from '@angular/core';

interface Meta {
  nombre: string;
  actual: number;
  objetivo: number;
  color: string;
  icono: string;
}

@Component({
  selector: 'app-metas-ahorro',
  imports: [],
  templateUrl: './metas-ahorro.html',
  styleUrl: './metas-ahorro.css',
})
export class MetasAhorro{

  readonly metas: Meta[] = [
    { nombre: 'Vacaciones',       actual: 3400,  objetivo: 5000,  color: '#10b981', icono: '✈️' },
    { nombre: 'Fondo emergencia', actual: 2100,  objetivo: 5000,  color: '#3b82f6', icono: '🛡️' },
    { nombre: 'Laptop nueva',     actual: 2550,  objetivo: 3000,  color: '#f59e0b', icono: '💻' },
  ];

  getPorcentaje(meta: Meta): number {
    return Math.min(Math.round((meta.actual / meta.objetivo) * 100), 100);
  }
} 