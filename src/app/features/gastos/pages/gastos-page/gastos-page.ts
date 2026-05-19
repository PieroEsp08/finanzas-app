import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CardMetrica } from '../../../../shared/components/card-metrica/card-metrica';
import { GraficoGastos } from '../../components/grafico-gastos/grafico-gastos';
import { TrendingDown, Hash, BarChart2, LucideIconData } from 'lucide-angular';

interface Gasto {
  concepto: string;
  categoria: string;
  fecha: string;
  monto: number;
}

@Component({
  selector: 'app-gastos-page',
  imports: [FormsModule, CardMetrica, GraficoGastos],
  templateUrl: './gastos-page.html',
  styleUrl: './gastos-page.css',
})
export class GastosPage {

  readonly trendingDownIcon: LucideIconData = TrendingDown;
  readonly hashIcon: LucideIconData = Hash;
  readonly barChartIcon: LucideIconData = BarChart2;

  readonly categorias = [
    'Alimentación', 'Transporte', 'Entretenimiento', 'Servicios', 'Salud', 'Educación', 'Otros',
  ];

  readonly categoriaColores: Record<string, string> = {
    'Alimentación':     'bg-orange-50 text-orange-700 border-orange-200',
    'Transporte':       'bg-cyan-50 text-cyan-700 border-cyan-200',
    'Entretenimiento':  'bg-pink-50 text-pink-700 border-pink-200',
    'Servicios':        'bg-amber-50 text-amber-700 border-amber-200',
    'Salud':            'bg-red-50 text-red-700 border-red-200',
    'Educación':        'bg-indigo-50 text-indigo-700 border-indigo-200',
    'Otros':            'bg-violet-50 text-violet-700 border-violet-200',
  };

  readonly gastos: Gasto[] = [
    { concepto: 'Renta departamento',      categoria: 'Servicios',       fecha: '01/12/2024', monto: 5200 },
    { concepto: 'Supermercado semanal',    categoria: 'Alimentación',    fecha: '02/12/2024', monto: 680  },
    { concepto: 'Gasolina',                categoria: 'Transporte',      fecha: '03/12/2024', monto: 1200 },
    { concepto: 'Netflix + Spotify',       categoria: 'Entretenimiento', fecha: '05/12/2024', monto: 260  },
    { concepto: 'Restaurante aniversario', categoria: 'Alimentación',    fecha: '07/12/2024', monto: 890  },
    { concepto: 'Internet fibra',          categoria: 'Servicios',       fecha: '08/12/2024', monto: 599  },
    { concepto: 'Uber viajes semana',      categoria: 'Transporte',      fecha: '10/12/2024', monto: 450  },
    { concepto: 'Cine y palomitas',        categoria: 'Entretenimiento', fecha: '11/12/2024', monto: 320  },
    { concepto: 'Electricidad',            categoria: 'Servicios',       fecha: '13/12/2024', monto: 780  },
    { concepto: 'Farmacia',                categoria: 'Salud',           fecha: '14/12/2024', monto: 342  },
    { concepto: 'Curso Angular',           categoria: 'Educación',       fecha: '15/12/2024', monto: 300  },
    { concepto: 'Supermercado semanal 2',  categoria: 'Alimentación',    fecha: '16/12/2024', monto: 750  },
  ];

  categoriaFiltro: string = 'todas';
  modalAbierto: boolean = false;
  dropdownFiltroAbierto: boolean = false;
  dropdownModalAbierto: boolean = false;
  paginaActual: number = 1;
  readonly registrosPorPagina: number = 5;

  nuevoConcepto: string = '';
  nuevoMonto: number | null = null;
  nuevaCategoria: string = '';
  nuevaFecha: string = '';

  get labelFiltroActivo(): string {
    return this.categoriaFiltro === 'todas' ? 'Todas las categorías' : this.categoriaFiltro;
  }

  get gastosFiltrados(): Gasto[] {
    if (this.categoriaFiltro === 'todas') return this.gastos;
    return this.gastos.filter(g => g.categoria === this.categoriaFiltro);
  }

  get gastosPaginados(): Gasto[] {
    const inicio = (this.paginaActual - 1) * this.registrosPorPagina;
    return this.gastosFiltrados.slice(inicio, inicio + this.registrosPorPagina);
  }

  get totalPaginas(): number {
    return Math.ceil(this.gastosFiltrados.length / this.registrosPorPagina);
  }

  get paginas(): number[] {
    return Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
  }

  get registrosMostrados(): number {
    return Math.min(this.paginaActual * this.registrosPorPagina, this.gastosFiltrados.length);
  }

  get filasVacias(): number[] {
    const filas = this.registrosPorPagina - this.gastosPaginados.length;
    return Array.from({ length: filas }, (_, i) => i);
  }

  get totalGastos(): number {
    return this.gastos.reduce((acc, g) => acc + g.monto, 0);
  }

  get totalTransacciones(): number {
    return this.gastos.length;
  }

  get promedioPorGasto(): number {
    if (this.gastos.length === 0) return 0;
    return Math.round(this.totalGastos / this.totalTransacciones);
  }

  getColorCategoria(categoria: string): string {
    return this.categoriaColores[categoria] ?? 'bg-gray-100 text-gray-600 border-gray-200';
  }

  cambiarPagina(pagina: number): void {
    if (pagina < 1 || pagina > this.totalPaginas) return;
    this.paginaActual = pagina;
  }

  seleccionarFiltro(valor: string): void {
    this.categoriaFiltro = valor;
    this.dropdownFiltroAbierto = false;
    this.paginaActual = 1;
  }

  seleccionarCategoria(cat: string): void {
    this.nuevaCategoria = cat;
    this.dropdownModalAbierto = false;
  }

  abrirModal(): void {
    this.modalAbierto = true;
    this.dropdownFiltroAbierto = false;
  }

  cerrarModal(): void {
    this.modalAbierto = false;
    this.dropdownModalAbierto = false;
    this.resetFormulario();
  }

  resetFormulario(): void {
    this.nuevoConcepto = '';
    this.nuevoMonto = null;
    this.nuevaCategoria = '';
    this.nuevaFecha = '';
  }
}