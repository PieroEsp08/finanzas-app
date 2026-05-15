import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Transaccion {
  concepto: string;
  categoria: string;
  fecha: string;
  monto: number;
  tipo: 'ingreso' | 'gasto';
  icono: string;
}

@Component({
  selector: 'app-transacciones-recientes',
  imports: [CommonModule],
  templateUrl: './transacciones-recientes.html',
  styleUrl: './transacciones-recientes.css',
})
export class TransaccionesRecientes {

  filtroActivo: 'todas' | 'ingresos' | 'gastos' = 'todas';

  readonly transacciones: Transaccion[] = [
    { concepto: 'Salario diciembre',       categoria: 'Salario',         fecha: '01 dic', monto: 18500, tipo: 'ingreso', icono: '💼' },
    { concepto: 'Proyecto web Nexora',     categoria: 'Freelance',       fecha: '03 dic', monto: 4200,  tipo: 'ingreso', icono: '💻' },
    { concepto: 'Renta departamento',      categoria: 'Servicios',       fecha: '01 dic', monto: 5200,  tipo: 'gasto',   icono: '⚡' },
    { concepto: 'Supermercado',            categoria: 'Alimentación',    fecha: '02 dic', monto: 680,   tipo: 'gasto',   icono: '🛒' },
    { concepto: 'Gasolina',                categoria: 'Transporte',      fecha: '03 dic', monto: 1200,  tipo: 'gasto',   icono: '🚗' },
    { concepto: 'Dividendos ETF SP500',    categoria: 'Inversiones',     fecha: '05 dic', monto: 350,   tipo: 'ingreso', icono: '📈' },
    { concepto: 'Netflix + Spotify',       categoria: 'Entretenimiento', fecha: '05 dic', monto: 260,   tipo: 'gasto',   icono: '🎮' },
    { concepto: 'Restaurante aniversario', categoria: 'Alimentación',    fecha: '07 dic', monto: 890,   tipo: 'gasto',   icono: '🍽️' },
  ];

  get transaccionesFiltradas(): Transaccion[] {
    if (this.filtroActivo === 'ingresos') return this.transacciones.filter(t => t.tipo === 'ingreso');
    if (this.filtroActivo === 'gastos')   return this.transacciones.filter(t => t.tipo === 'gasto');
    return this.transacciones;
  }

  setFiltro(filtro: 'todas' | 'ingresos' | 'gastos'): void {
    this.filtroActivo = filtro;
  }
}