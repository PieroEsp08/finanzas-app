import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CardMeta, Meta } from '../../components/card-meta/card-meta';

@Component({
  selector: 'app-metas-page',
  imports: [FormsModule, CardMeta],
  templateUrl: './metas-page.html',
  styleUrl: './metas-page.css',
})
export class MetasPage {

  readonly colores = [
    '#10b981', '#3b82f6', '#f59e0b', '#8b5cf6',
    '#ec4899', '#06b6d4', '#f97316', '#ef4444',
  ];

  readonly iconos = ['✈️', '🛡️', '💻', '🚗', '🎓', '🏠', '💰', '🎯', '🏋️', '🎸'];

  readonly filtros = [
    { valor: 'todas',       label: 'Todas' },
    { valor: 'activas',     label: 'Activas' },
    { valor: 'completadas', label: 'Completadas' },
  ];

  readonly opcionesOrden = [
    { valor: 'porcentaje-desc', label: 'Mayor % completado' },
    { valor: 'porcentaje-asc',  label: 'Menor % completado' },
    { valor: 'faltante-asc',    label: 'Menor monto faltante' },
    { valor: 'faltante-desc',   label: 'Mayor monto faltante' },
    { valor: 'fecha-asc',       label: 'Fecha más próxima' },
    { valor: 'fecha-desc',      label: 'Fecha más lejana' },
  ];

  metas: Meta[] = [
    { nombre: 'Vacaciones',       descripcion: 'Viaje a Europa en verano',    actual: 3400,  objetivo: 5000,  color: '#10b981', icono: '✈️',  fechaLimite: 'Jul 2025' },
    { nombre: 'Fondo emergencia', descripcion: 'Reserva para imprevistos',    actual: 2100,  objetivo: 5000,  color: '#3b82f6', icono: '🛡️', fechaLimite: 'Dic 2025' },
    { nombre: 'Laptop nueva',     descripcion: 'MacBook Pro para trabajo',    actual: 2550,  objetivo: 3000,  color: '#f59e0b', icono: '💻',  fechaLimite: 'Mar 2025' },
    { nombre: 'Auto',             descripcion: 'Inicial para compra de auto', actual: 8000,  objetivo: 20000, color: '#8b5cf6', icono: '🚗',  fechaLimite: 'Ene 2026' },
    { nombre: 'Educación',        descripcion: 'Maestría en administración',  actual: 1200,  objetivo: 8000,  color: '#ec4899', icono: '🎓',  fechaLimite: 'Ago 2025' },
    { nombre: 'Remodelación',     descripcion: 'Renovar sala y cocina',       actual: 6000,  objetivo: 6000,  color: '#06b6d4', icono: '🏠',  fechaLimite: 'Jun 2025' },
  ];

  // Estados de visibilidad para Modales y Dropdowns
  modalAbierto = false;
  modalAbonarAbierto = false;
  modalEditarAbierto = false;
  dropdownIconoAbierto = false;
  dropdownOrdenAbierto = false;
  
  filtroActivo = 'todas';
  ordenActivo = 'porcentaje-desc';

  // Propiedades temporales para los formularios
  nuevoNombre = '';
  nuevaDescripcion = '';
  nuevoObjetivo: number | null = null;
  nuevoActual: number | null = null;
  nuevoIcono = '';
  nuevoColor = '#10b981';
  nuevaFechaLimite = '';

  get metasFiltradas(): Meta[] {
    const filtradas = this.metas.filter(m => {
      const pct = m.actual / m.objetivo;
      if (this.filtroActivo === 'activas') return pct < 1;
      if (this.filtroActivo === 'completadas') return pct >= 1;
      return true;
    });

    return filtradas.sort((a, b) => {
      switch (this.ordenActivo) {
        case 'porcentaje-desc': return (b.actual / b.objetivo) - (a.actual / a.objetivo);
        case 'porcentaje-asc':  return (a.actual / a.objetivo) - (b.actual / b.objetivo);
        case 'faltante-asc':    return (a.objetivo - a.actual) - (b.objetivo - b.actual);
        case 'faltante-desc':   return (b.objetivo - b.actual) - (a.objetivo - a.actual);
        case 'fecha-asc':       return new Date(a.fechaLimite).getTime() - new Date(b.fechaLimite).getTime();
        case 'fecha-desc':      return new Date(b.fechaLimite).getTime() - new Date(a.fechaLimite).getTime();
        default: return 0;
      }
    });
  }

  get labelOrdenActivo(): string {
    return this.opcionesOrden.find(o => o.valor === this.ordenActivo)?.label ?? 'Ordenar';
  }

  seleccionarFiltro(valor: string): void { this.filtroActivo = valor; }

  seleccionarOrden(valor: string): void {
    this.ordenActivo = valor;
    this.dropdownOrdenAbierto = false;
  }

  // Controladores del Modal: Nueva Meta
  abrirModal(): void { this.modalAbierto = true; }
  cerrarModal(): void {
    this.modalAbierto = false;
    this.dropdownIconoAbierto = false;
    this.dropdownOrdenAbierto = false;
    this.resetFormulario();
  }

  // Controladores del Modal: Abonar
  abrirModalAbonar(index: number): void { this.modalAbonarAbierto = true; }
  cerrarModalAbonar(): void { this.modalAbonarAbierto = false; }

  // Controladores del Modal: Editar
  abrirModalEditar(index: number): void { this.modalEditarAbierto = true; }
  cerrarModalEditar(): void { this.modalEditarAbierto = false; }

  // Acciones secundarias
  eliminarMeta(index: number): void { this.metas = this.metas.filter((_, i) => i !== index); }

  seleccionarIcono(icono: string): void {
    this.nuevoIcono = icono;
    this.dropdownIconoAbierto = false;
  }

  seleccionarColor(color: string): void { this.nuevoColor = color; }

  resetFormulario(): void {
    this.nuevoNombre = '';
    this.nuevaDescripcion = '';
    this.nuevoObjetivo = null;
    this.nuevoActual = null;
    this.nuevoIcono = '';
    this.nuevoColor = '#10b981';
    this.nuevaFechaLimite = '';
  }

  crearMetaPrediseniada(nombre: string, objetivo: number, icono: string, color: string) {
    this.nuevoNombre = nombre;
    this.nuevoObjetivo = objetivo;
    this.nuevoIcono = icono;
    this.nuevoColor = color;
    this.nuevaDescripcion = 'Meta sugerida';
    this.nuevoActual = 0;
    this.abrirModal(); 
  }
}