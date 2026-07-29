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
  selector: 'app-grafico-ingresos',
  imports: [],
  templateUrl: './grafico-ingresos.html',
  styleUrl: './grafico-ingresos.css',
})
export class GraficoIngresos implements AfterViewInit, OnDestroy {

  @ViewChild('barChart') barChart!: ElementRef<HTMLCanvasElement>;

  chart!: Chart;

  // Recibimos los datos del componente padre
  private _ingresos: Transaccion[] = [];
  private _categorias: Categoria[] = [];

  @Input() set ingresos(value: Transaccion[]) {
    this._ingresos = value || [];
    this.actualizarGrafico();
  }

  get ingresos(): Transaccion[] {
    return this._ingresos;
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

  initChart() {
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
            backgroundColor: ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#06b6d4', '#ec4899', '#14b8a6'],
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

  private actualizarGrafico() {
  if (!this.chart || this._ingresos.length === 0) {
    if (this.chart) {
      this.chart.data.labels = ['Sin datos'];
      this.chart.data.datasets[0].data = [0];
      this.chart.data.datasets[0].backgroundColor = ['#e5e7eb'];
      this.chart.update();
    }
    return;
  }

  // Mapa para acumular por ID o Nombre de categoría
  // Guarda: { nombre, emoji, color, total }
  const mapaCategorias = new Map<string, { nombre: string; emoji: string; color: string; total: number }>();

  this._ingresos.forEach(ingreso => {
    const catIdStr = String(ingreso.categoriaId);

    // 1. Buscamos primero en el arreglo de categorías activas
    const catActiva = this._categorias.find(c => String(c.id) === catIdStr);
    
    // 2. Si no está activa, recuperamos el objeto 'categoria' embebido en la transacción
    const catEmbebida = (ingreso as any).categoria;

    // Rescatamos los valores reales (si viene activa, embebida, o propiedades en la raíz)
    const nombre = catActiva?.nombre 
      || catEmbebida?.nombre 
      || (ingreso as any).categoriaNombre 
      || 'Sin nombre';

    const emoji = catActiva?.emoji 
      || catEmbebida?.emoji 
      || (ingreso as any).categoriaEmoji 
      || '';

    const color = (catActiva as any)?.color 
      || catEmbebida?.color 
      || (ingreso as any).categoriaColor 
      || '#10b981';

    // Usamos el ID como llave para agrupar las transacciones de la misma categoría
    const key = catIdStr !== 'undefined' && catIdStr !== 'null' ? catIdStr : nombre;

    if (!mapaCategorias.has(key)) {
      mapaCategorias.set(key, { nombre, emoji, color, total: 0 });
    }

    const item = mapaCategorias.get(key)!;
    item.total += ingreso.monto;
  });

  // 3. Extraer los datos listos para Chart.js
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

  // 4. Actualizar la gráfica
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