import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CardMetrica } from '../../../../shared/components/card-metrica/card-metrica';
import { GraficoIngresos } from '../../components/grafico-ingresos/grafico-ingresos';
import { TrendingUp, Hash, BarChart2, LucideIconData } from 'lucide-angular';

interface Ingreso {
  concepto: string;
  categoria: string;
  fecha: string;
  monto: number;
}

@Component({
  selector: 'app-ingresos-page',
  imports: [FormsModule, CardMetrica, GraficoIngresos],
  templateUrl: './ingresos-page.html',
  styleUrl: './ingresos-page.css',
})
export class IngresosPage {

  readonly trendingUpIcon: LucideIconData = TrendingUp;
  readonly hashIcon: LucideIconData = Hash;
  readonly barChartIcon: LucideIconData = BarChart2;

  readonly categorias = [
    'Salario', 'Freelance', 'Inversiones', 'Bonos', 'Alquiler', 'Otros',
  ];

  readonly categoriaColores: Record<string, string> = {
    'Salario':     'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Freelance':   'bg-blue-50 text-blue-700 border-blue-200',
    'Inversiones': 'bg-violet-50 text-violet-700 border-violet-200',
    'Bonos':       'bg-amber-50 text-amber-700 border-amber-200',
    'Alquiler':    'bg-cyan-50 text-cyan-700 border-cyan-200',
    'Otros':       'bg-gray-100 text-gray-600 border-gray-200',
  };

  readonly ingresos: Ingreso[] = [
    { concepto: 'Salario diciembre',    categoria: 'Salario',     fecha: '01/12/2024', monto: 18500 },
    { concepto: 'Proyecto web Nexora',  categoria: 'Freelance',   fecha: '03/12/2024', monto: 4200  },
    { concepto: 'Dividendos ETF SP500', categoria: 'Inversiones', fecha: '05/12/2024', monto: 350   },
    { concepto: 'Bono fin de año',      categoria: 'Bonos',       fecha: '12/12/2024', monto: 1000  },
    { concepto: 'Venta diseño logo',    categoria: 'Freelance',   fecha: '09/12/2024', monto: 800   },
    { concepto: 'Salario noviembre',    categoria: 'Salario',     fecha: '01/11/2024', monto: 18500 },
    { concepto: 'Proyecto app móvil',   categoria: 'Freelance',   fecha: '15/11/2024', monto: 3200  },
    { concepto: 'Dividendos acciones',  categoria: 'Inversiones', fecha: '10/11/2024', monto: 280   },
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

  get ingresosFiltrados(): Ingreso[] {
    if (this.categoriaFiltro === 'todas') return this.ingresos;
    return this.ingresos.filter(i => i.categoria === this.categoriaFiltro);
  }

  get ingresosPaginados(): Ingreso[] {
    const inicio = (this.paginaActual - 1) * this.registrosPorPagina;
    return this.ingresosFiltrados.slice(inicio, inicio + this.registrosPorPagina);
  }

  get totalPaginas(): number {
    return Math.ceil(this.ingresosFiltrados.length / this.registrosPorPagina);
  }

  get paginas(): number[] {
    return Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
  }

  get registrosMostrados(): number {
    return Math.min(this.paginaActual * this.registrosPorPagina, this.ingresosFiltrados.length);
  }

  get filasVacias(): number[] {
    const filas = this.registrosPorPagina - this.ingresosPaginados.length;
    return Array.from({ length: filas }, (_, i) => i);
  }

  get totalIngresos(): number {
    return this.ingresos.reduce((acc, i) => acc + i.monto, 0);
  }

  get totalTransacciones(): number {
    return this.ingresos.length;
  }

  get promedioPorIngreso(): number {
    if (this.ingresos.length === 0) return 0;
    return Math.round(this.totalIngresos / this.totalTransacciones);
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