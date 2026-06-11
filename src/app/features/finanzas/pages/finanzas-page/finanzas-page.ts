import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Movimiento {
  concepto: string;
  categoria: string;
  fecha: string;
  monto: number;
  tipo: 'ingreso' | 'gasto';
}

@Component({
  selector: 'app-finanzas-page',
  imports: [FormsModule],
  templateUrl: './finanzas-page.html',
  styleUrl: './finanzas-page.css',
})
export class FinanzasPage {

  readonly registrosPorPagina = 10;

  readonly categoriaColores: Record<string, string> = {
    'Salario':          'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Freelance':        'bg-blue-50 text-blue-700 border-blue-200',
    'Inversiones':      'bg-violet-50 text-violet-700 border-violet-200',
    'Bonos':            'bg-amber-50 text-amber-700 border-amber-200',
    'Alquiler':         'bg-cyan-50 text-cyan-700 border-cyan-200',
    'Alimentación':     'bg-orange-50 text-orange-700 border-orange-200',
    'Transporte':       'bg-cyan-50 text-cyan-700 border-cyan-200',
    'Entretenimiento':  'bg-pink-50 text-pink-700 border-pink-200',
    'Servicios':        'bg-amber-50 text-amber-700 border-amber-200',
    'Salud':            'bg-red-50 text-red-700 border-red-200',
    'Educación':        'bg-indigo-50 text-indigo-700 border-indigo-200',
    'Otros':            'bg-gray-100 text-gray-600 border-gray-200',
  };

  readonly meses = [
    { valor: '',   label: 'Todos' },
    { valor: '01', label: 'Enero' },
    { valor: '02', label: 'Febrero' },
    { valor: '03', label: 'Marzo' },
    { valor: '04', label: 'Abril' },
    { valor: '05', label: 'Mayo' },
    { valor: '06', label: 'Junio' },
    { valor: '07', label: 'Julio' },
    { valor: '08', label: 'Agosto' },
    { valor: '09', label: 'Septiembre' },
    { valor: '10', label: 'Octubre' },
    { valor: '11', label: 'Noviembre' },
    { valor: '12', label: 'Diciembre' },
  ];

  readonly movimientos: Movimiento[] = [
    { concepto: 'Salario diciembre',       categoria: 'Salario',         fecha: '01/12/2024', monto: 18500, tipo: 'ingreso' },
    { concepto: 'Renta departamento',      categoria: 'Servicios',       fecha: '01/12/2024', monto: 5200,  tipo: 'gasto'   },
    { concepto: 'Proyecto web Nexora',     categoria: 'Freelance',       fecha: '03/12/2024', monto: 4200,  tipo: 'ingreso' },
    { concepto: 'Supermercado semanal',    categoria: 'Alimentación',    fecha: '02/12/2024', monto: 680,   tipo: 'gasto'   },
    { concepto: 'Gasolina',                categoria: 'Transporte',      fecha: '03/12/2024', monto: 1200,  tipo: 'gasto'   },
    { concepto: 'Dividendos ETF SP500',    categoria: 'Inversiones',     fecha: '05/12/2024', monto: 350,   tipo: 'ingreso' },
    { concepto: 'Netflix + Spotify',       categoria: 'Entretenimiento', fecha: '05/12/2024', monto: 260,   tipo: 'gasto'   },
    { concepto: 'Restaurante aniversario', categoria: 'Alimentación',    fecha: '07/12/2024', monto: 890,   tipo: 'gasto'   },
    { concepto: 'Internet fibra',          categoria: 'Servicios',       fecha: '08/12/2024', monto: 599,   tipo: 'gasto'   },
    { concepto: 'Venta diseño logo',       categoria: 'Freelance',       fecha: '09/12/2024', monto: 800,   tipo: 'ingreso' },
    { concepto: 'Uber viajes semana',      categoria: 'Transporte',      fecha: '10/12/2024', monto: 450,   tipo: 'gasto'   },
    { concepto: 'Cine y palomitas',        categoria: 'Entretenimiento', fecha: '11/12/2024', monto: 320,   tipo: 'gasto'   },
    { concepto: 'Bono fin de año',         categoria: 'Bonos',           fecha: '12/12/2024', monto: 1000,  tipo: 'ingreso' },
    { concepto: 'Electricidad',            categoria: 'Servicios',       fecha: '13/12/2024', monto: 780,   tipo: 'gasto'   },
    { concepto: 'Farmacia',                categoria: 'Salud',           fecha: '14/12/2024', monto: 342,   tipo: 'gasto'   },
  ];

  tipoFiltro: 'todos' | 'ingreso' | 'gasto' = 'todos';
  categoriaFiltro: string = 'todas';
  mesFiltro: string = '';
  anoFiltro: string = '';
  dropdownFiltroAbierto: boolean = false;
  dropdownMesAbierto: boolean = false;
  dropdownAnoAbierto: boolean = false;
  paginaActual: number = 1;

  get anos(): string[] {
    return [...new Set(this.movimientos.map(m =>
      m.fecha.split('/')[2]
    ))].sort((a, b) => parseInt(b) - parseInt(a));
  }

  get categorias(): string[] {
    return [...new Set(this.movimientos.map(m => m.categoria))].sort();
  }

  get labelFiltroActivo(): string {
    return this.categoriaFiltro === 'todas' ? 'Todas las categorías' : this.categoriaFiltro;
  }

  get labelMesActivo(): string {
    return this.meses.find(m => m.valor === this.mesFiltro)?.label ?? 'Todos los meses';
  }

  get labelAnoActivo(): string {
    return this.anoFiltro === '' ? 'Todos los años' : this.anoFiltro;
  }

  get movimientosFiltrados(): Movimiento[] {
    return this.movimientos.filter(m => {
      const partes = m.fecha.split('/');
      const matchTipo = this.tipoFiltro === 'todos' || m.tipo === this.tipoFiltro;
      const matchCategoria = this.categoriaFiltro === 'todas' || m.categoria === this.categoriaFiltro;
      const matchMes = this.mesFiltro === '' || partes[1] === this.mesFiltro;
      const matchAno = this.anoFiltro === '' || partes[2] === this.anoFiltro;
      return matchTipo && matchCategoria && matchMes && matchAno;
    });
  }

  get movimientosPaginados(): Movimiento[] {
    const inicio = (this.paginaActual - 1) * this.registrosPorPagina;
    return this.movimientosFiltrados.slice(inicio, inicio + this.registrosPorPagina);
  }

  get totalPaginas(): number {
    return Math.ceil(this.movimientosFiltrados.length / this.registrosPorPagina);
  }

  get paginas(): number[] {
    return Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
  }

  get registrosMostrados(): number {
    return Math.min(this.paginaActual * this.registrosPorPagina, this.movimientosFiltrados.length);
  }

  getColorCategoria(categoria: string): string {
    return this.categoriaColores[categoria] ?? 'bg-gray-100 text-gray-600 border-gray-200';
  }

  setTipoFiltro(tipo: 'todos' | 'ingreso' | 'gasto'): void {
    this.tipoFiltro = tipo;
    this.paginaActual = 1;
  }

  seleccionarFiltro(valor: string): void {
    this.categoriaFiltro = valor;
    this.dropdownFiltroAbierto = false;
    this.paginaActual = 1;
  }

  seleccionarMes(valor: string): void {
    this.mesFiltro = valor;
    this.dropdownMesAbierto = false;
    this.paginaActual = 1;
  }

  seleccionarAno(valor: string): void {
    this.anoFiltro = valor;
    this.dropdownAnoAbierto = false;
    this.paginaActual = 1;
  }

  cerrarDropdowns(): void {
    this.dropdownFiltroAbierto = false;
    this.dropdownMesAbierto = false;
    this.dropdownAnoAbierto = false;
  }

  cambiarPagina(pagina: number): void {
    if (pagina < 1 || pagina > this.totalPaginas) return;
    this.paginaActual = pagina;
  }
}