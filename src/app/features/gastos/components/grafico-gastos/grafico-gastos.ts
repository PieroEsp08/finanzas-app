import { Component, AfterViewInit, ViewChild, ElementRef, OnDestroy, Input } from '@angular/core';
import { Chart, ChartConfiguration } from 'chart.js/auto';

// Interfaces locales para tipar los datos
interface Transaccion {
  id?: string;
  concepto: string;
  monto: number;
  categoriaId: string;
  fecha: string;
}

interface Categoria {
  id?: string;
  nombre: string;
  emoji?: string;
}

@Component({
  selector: 'app-grafico-gastos',
  imports: [],
  templateUrl: './grafico-gastos.html',
  styleUrl: './grafico-gastos.css',
})
export class GraficoGastos implements AfterViewInit, OnDestroy {

  @ViewChild('barChart') barChart!: ElementRef<HTMLCanvasElement>;

  chart!: Chart;

  // Recibimos los datos del componente padre (GastosPage)
  private _gastos: Transaccion[] = [];
  private _categorias: Categoria[] = [];

  @Input() set gastos(value: Transaccion[]) {
    this._gastos = value || [];
    this.actualizarGrafico();
  }

  get gastos(): Transaccion[] {
    return this._gastos;
  }

  @Input() set categorias(value: Categoria[]) {
    this._categorias = value || [];
    this.actualizarGrafico();
  }

  get categorias(): Categoria[] {
    return this._categorias;
  }

  ngAfterViewInit(): void {
    this.initChart();
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }

  initChart(): void {
    const ctx = this.barChart.nativeElement.getContext('2d');
    if (!ctx) return;

    // Inicializamos el gráfico vacío
    const config: ChartConfiguration<'bar'> = {
      type: 'bar',
      data: {
        labels: [],
        datasets: [
          {
            label: 'Monto',
            data: [],
            // Paleta con tonos cálidos/rojos/naranjas adecuados para gastos
            backgroundColor: ['#f97316', '#ef4444', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4', '#6366f1'],
            borderRadius: 8,
            borderSkipped: false,
            barPercentage: 0.5,
          }
        ]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#1a1d21',
            titleColor: '#ffffff',
            bodyColor: '#d1d5db',
            padding: 10,
            cornerRadius: 8,
            callbacks: {
              label: (ctx) => {
                const value = ctx.parsed.x ?? 0;
                return ` S/ ${value.toLocaleString('es-PE')}`;
              }
            }
          }
        },
        scales: {
          x: {
            border: { display: false },
            grid: { color: 'rgba(0,0,0,0.04)' },
            ticks: {
              color: '#9ca3af',
              callback: (value) => 'S/ ' + (Number(value) >= 1000 ? (Number(value) / 1000) + 'k' : value)
            }
          },
          y: {
            border: { display: false },
            grid: { display: false },
            ticks: {
              color: '#6b7280',
              font: { weight: 500 }
            }
          }
        }
      }
    };

    this.chart = new Chart(ctx, config);
    this.actualizarGrafico(); // Carga la data inicial si ya existe
  }

  private actualizarGrafico(): void {
  // Salimos o limpiamos solo si no hay instancia de Chart o no hay gastos
  if (!this.chart || this._gastos.length === 0) {
    if (this.chart) {
      this.chart.data.labels = ['Sin datos'];
      this.chart.data.datasets[0].data = [0];
      this.chart.data.datasets[0].backgroundColor = ['#e5e7eb'];
      this.chart.update();
    }
    return;
  }

  // Mapa dinámico para agrupar por ID o Nombre de la categoría
  // Estructura: { nombre, emoji, color, total }
  const mapaCategorias = new Map<string, { nombre: string; emoji: string; color: string; total: number }>();

  this._gastos.forEach(gasto => {
    const catIdStr = String(gasto.categoriaId);

    // 1. Intentamos encontrar la categoría en la lista activa
    const catActiva = this._categorias.find(c => String(c.id) === catIdStr);

    // 2. Si no está activa, recuperamos el objeto embebido o las propiedades en la raíz
    const catEmbebida = (gasto as any).categoria;

    const nombre = catActiva?.nombre 
      || catEmbebida?.nombre 
      || (gasto as any).categoriaNombre 
      || 'Sin nombre';

    const emoji = catActiva?.emoji 
      || catEmbebida?.emoji 
      || (gasto as any).categoriaEmoji 
      || '';

    const color = (catActiva as any)?.color 
      || catEmbebida?.color 
      || (gasto as any).categoriaColor 
      || '#ef4444'; // Color por defecto para gastos (Rojo)

    // Agrupamos por ID o por nombre si no existiera un ID válido
    const key = catIdStr !== 'undefined' && catIdStr !== 'null' ? catIdStr : nombre;

    if (!mapaCategorias.has(key)) {
      mapaCategorias.set(key, { nombre, emoji, color, total: 0 });
    }

    const item = mapaCategorias.get(key)!;
    item.total += gasto.monto;
  });

  // 3. Extraer arreglos correspondientes para Chart.js
  const labels: string[] = [];
  const data: number[] = [];
  const colores: string[] = [];

  mapaCategorias.forEach(cat => {
    if (cat.total > 0) {
      labels.push(`${cat.emoji ? cat.emoji + ' ' : ''}${cat.nombre}`);
      data.push(cat.total);
      colores.push(cat.color);
    }
  });

  // 4. Renderizar en el gráfico
  if (data.length === 0) {
    this.chart.data.labels = ['Sin datos'];
    this.chart.data.datasets[0].data = [0];
    this.chart.data.datasets[0].backgroundColor = ['#e5e7eb'];
  } else {
    this.chart.data.labels = labels;
    this.chart.data.datasets[0].data = data;
    this.chart.data.datasets[0].backgroundColor = colores;
  }

  this.chart.update();
}
}