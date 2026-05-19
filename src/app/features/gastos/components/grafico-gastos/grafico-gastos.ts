import { Component, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Chart, ChartConfiguration } from 'chart.js/auto';

@Component({
  selector: 'app-grafico-gastos',
  imports: [],
  templateUrl: './grafico-gastos.html',
  styleUrl: './grafico-gastos.css',
})
export class GraficoGastos implements AfterViewInit, OnDestroy {

  @ViewChild('barChart') barChart!: ElementRef<HTMLCanvasElement>;

  chart!: Chart;

  ngAfterViewInit(): void {
    this.initChart();
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }

  initChart() {
    const ctx = this.barChart.nativeElement.getContext('2d');
    if (!ctx) return;

    const config: ChartConfiguration<'bar'> = {
      type: 'bar',
      data: {
        labels: ['Alimentación', 'Servicios', 'Transporte', 'Entretenimiento', 'Salud', 'Educación', 'Otros'],
        datasets: [
          {
            label: 'Monto',
            data: [3520, 6579, 1650, 580, 420, 300, 671],
            backgroundColor: ['#f97316', '#f59e0b', '#06b6d4', '#ec4899', '#ef4444', '#6366f1', '#8b5cf6'],
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
              callback: (value) => 'S/ ' + (Number(value) / 1000) + 'k'
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
  }
}