import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, X } from 'lucide-angular';
import { CardPresupuesto, Presupuesto } from '../../components/card-presupuesto/card-presupuesto';

interface Categoria {
  nombre: string;
  icono: string;
  color: string;
}

@Component({
  selector: 'app-presupuesto-page',
  imports: [CardPresupuesto, CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './presupuesto-page.html',
  styleUrl: './presupuesto-page.css',
})
export class PresupuestoPage {

  modalAbierto = false;
  categoriaSeleccionada = '';
  nuevoLimite: number | null = null;
  nuevoGastado: number | null = null;
  dropdownOrdenAbierto = false;
  ordenActivo = 'porcentaje-desc';
  filtroActivo = 'todos';

  icons = { close: X };

  readonly filtros = [
    { valor: 'todos',     label: 'Todos' },
    { valor: 'riesgo',    label: 'En riesgo' },
    { valor: 'excedidos', label: 'Excedidos' },
  ];

  readonly opcionesOrden = [
  { valor: 'porcentaje-desc', label: 'Mayor % usado' },
  { valor: 'porcentaje-asc',  label: 'Menor % usado' },
  { valor: 'gasto-desc',      label: 'Mayor gasto' },
  { valor: 'gasto-asc',       label: 'Menor gasto' },
  { valor: 'disponible-desc', label: 'Mayor disponible' },
  { valor: 'disponible-asc',  label: 'Menor disponible' },
];

  categorias: Categoria[] = [
    { nombre: 'Alimentación',    icono: '🍔', color: '#f97316' },
    { nombre: 'Transporte',      icono: '🚗', color: '#06b6d4' },
    { nombre: 'Servicios',       icono: '⚡', color: '#f59e0b' },
    { nombre: 'Entretenimiento', icono: '🎮', color: '#ec4899' },
    { nombre: 'Salud',           icono: '💊', color: '#ef4444' },
    { nombre: 'Educación',       icono: '📚', color: '#6366f1' },
    { nombre: 'Ropa',            icono: '👕', color: '#8b5cf6' },
    { nombre: 'Hogar',           icono: '🏠', color: '#10b981' },
  ];

  presupuestos: Presupuesto[] = [
    { nombre: 'Alimentación',    icono: '🍔', color: '#f97316', gastado: 3020, limite: 4500 },
    { nombre: 'Transporte',      icono: '🚗', color: '#06b6d4', gastado: 1500, limite: 3000 },
    { nombre: 'Servicios',       icono: '⚡', color: '#f59e0b', gastado: 2200, limite: 7000 },
    { nombre: 'Entretenimiento', icono: '🎮', color: '#ec4899', gastado: 850,  limite: 1000 },
    { nombre: 'Salud',           icono: '💊', color: '#ef4444', gastado: 320,  limite: 800  },
    { nombre: 'Educación',       icono: '📚', color: '#6366f1', gastado: 490,  limite: 500  },
  ];

  get presupuestosFiltrados(): Presupuesto[] {
    const filtrados = this.presupuestos.filter(p => {
      const pct = p.gastado / p.limite;
      if (this.filtroActivo === 'riesgo') return pct >= 0.8 && pct < 1;
      if (this.filtroActivo === 'excedidos') return pct >= 1;
      return true;
    });

    return filtrados.sort((a, b) => {
      switch (this.ordenActivo) {
        case 'porcentaje-desc': return (b.gastado / b.limite) - (a.gastado / a.limite);
        case 'porcentaje-asc':  return (a.gastado / a.limite) - (b.gastado / b.limite);
        case 'gasto-desc':      return b.gastado - a.gastado;
        case 'gasto-asc':       return a.gastado - b.gastado;
        case 'disponible-desc': return (b.limite - b.gastado) - (a.limite - a.gastado);
        case 'disponible-asc':  return (a.limite - a.gastado) - (b.limite - b.gastado);
        default: return 0;
      }
    });
  }

  get labelOrdenActivo(): string {
    return this.opcionesOrden.find(o => o.valor === this.ordenActivo)?.label ?? 'Ordenar';
  }

  getCategoriaSeleccionada(): Categoria | undefined {
    return this.categorias.find(c => c.nombre === this.categoriaSeleccionada);
  }

  onCategoriaChange(nombre: string): void {
    this.categoriaSeleccionada = nombre;
  }

  seleccionarFiltro(valor: string): void {
    this.filtroActivo = valor;
  }

  seleccionarOrden(valor: string): void {
    this.ordenActivo = valor;
    this.dropdownOrdenAbierto = false;
  }

  abrirModal(): void { this.modalAbierto = true; }

  cerrarModal(): void {
    this.modalAbierto = false;
    this.categoriaSeleccionada = '';
    this.nuevoLimite = null;
    this.nuevoGastado = null;
  }

  editarPresupuesto(index: number): void {
    console.log('Editar:', this.presupuestos[index].nombre);
  }

  eliminarPresupuesto(index: number): void {
    this.presupuestos.splice(index, 1);
  }
}