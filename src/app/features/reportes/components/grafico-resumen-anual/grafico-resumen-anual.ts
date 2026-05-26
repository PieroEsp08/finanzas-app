import { Component, AfterViewInit, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { Chart, ChartConfiguration } from 'chart.js/auto';

@Component({
  selector: 'app-grafico-resumen-anual',
  imports: [],
  templateUrl: './grafico-resumen-anual.html',
  styleUrl: './grafico-resumen-anual.css',
})
export class GraficoResumenAnual implements AfterViewInit, OnDestroy {

  @ViewChild('annualChart') annualChart!: ElementRef<HTMLCanvasElement>;

  chart!: Chart;

  ngAfterViewInit(): void {
    this.initChart();
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }

  initChart() {
    const ctx = this.annualChart.nativeElement.getContext('2d');
    if (!ctx) return;

    const config: ChartConfiguration<'bar'> = {
      type: 'bar',
      data: {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        datasets: [
          {
            label: 'Ingresos',
            data: [20500, 21000, 22000, 21500, 20800, 23000, 21200, 22800, 20100, 23500, 22080, 24850],
            backgroundColor: '#10b981',
            borderRadius: 6,
            borderSkipped: false,
            barPercentage: 0.7,
            categoryPercentage: 0.7,
          },
          {
            label: 'Gastos',
            data: [14000, 13500, 15000, 14200, 13800, 15500, 14800, 16200, 13500, 15800, 15235, 15720],
            backgroundColor: '#f43f5e',
            borderRadius: 6,
            borderSkipped: false,
            barPercentage: 0.7,
            categoryPercentage: 0.7,
          },
          {
            label: 'Ahorro',
            data: [6500, 7500, 7000, 7300, 7000, 7500, 6400, 6600, 6600, 7700, 6845, 9130],
            backgroundColor: '#3b82f6',
            borderRadius: 6,
            borderSkipped: false,
            barPercentage: 0.7,
            categoryPercentage: 0.7,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            align: 'end',
            labels: {
              boxWidth: 10,
              boxHeight: 10,
              borderRadius: 3,
              useBorderRadius: true,
              color: '#6b7280',
              font: { size: 12, family: 'Plus Jakarta Sans' },
              padding: 16,
            }
          },
          tooltip: {
            backgroundColor: '#1a1d21',
            padding: 12,
            cornerRadius: 10,
            callbacks: {
              label: (ctx) => {
                const value = ctx.parsed.y ?? 0;
                return ` ${ctx.dataset.label}: S/ ${value.toLocaleString('es-PE')}`;
              }
            }
          }
        },
        scales: {
          x: {
            border: { display: false },
            grid: { display: false },
            ticks: { color: '#9ca3af', font: { size: 11, family: 'Plus Jakarta Sans' } }
          },
          y: {
            border: { display: false },
            grid: { color: 'rgba(0,0,0,0.04)' },
            ticks: {
              color: '#9ca3af',
              font: { size: 11, family: 'Plus Jakarta Sans' },
              callback: (value) => 'S/ ' + (Number(value) / 1000) + 'k'
            }
          }
        }
      }
    };

    this.chart = new Chart(ctx, config);
  }
}