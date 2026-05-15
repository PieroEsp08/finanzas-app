import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Chart, ChartConfiguration } from 'chart.js/auto';

@Component({
  selector: 'app-grafico-tendencia-financiera',
  imports: [],
  templateUrl: './grafico-tendencia-financiera.html',
  styleUrl: './grafico-tendencia-financiera.css',
})
export class GraficoTendenciaFinanciera implements AfterViewInit {

  @ViewChild('lineChart') lineChart!: ElementRef<HTMLCanvasElement>;

  chart!: Chart;

  ngAfterViewInit(): void {
    this.initChart();
  }

  initChart() {
    const ctx = this.lineChart.nativeElement.getContext('2d');

    if (!ctx) return;

    const gradientGreen = ctx.createLinearGradient(0, 0, 0, 300);
    gradientGreen.addColorStop(0, 'rgba(16,185,129,0.25)');
    gradientGreen.addColorStop(1, 'rgba(16,185,129,0)');

    const gradientRed = ctx.createLinearGradient(0, 0, 0, 300);
    gradientRed.addColorStop(0, 'rgba(244,63,94,0.20)');
    gradientRed.addColorStop(1, 'rgba(244,63,94,0)');

    const config: ChartConfiguration<'line'> = {
      type: 'line',
      data: {
        labels: ['Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        datasets: [
          {
            label: 'Ingresos',
            data: [21200, 22800, 20100, 23500, 22080, 24850],
            borderColor: '#10b981',
            backgroundColor: gradientGreen,
            fill: true,
            tension: 0.4,
            borderWidth: 3,
            pointRadius: 0,
            pointHoverRadius: 6,
            pointHoverBackgroundColor: '#10b981',
            pointHoverBorderColor: '#fff',
            pointHoverBorderWidth: 2
          },
          {
            label: 'Gastos',
            data: [14800, 16200, 13500, 15800, 15235, 15720],
            borderColor: '#f43f5e',
            backgroundColor: gradientRed,
            fill: true,
            tension: 0.4,
            borderWidth: 3,
            pointRadius: 0,
            pointHoverRadius: 6,
            pointHoverBackgroundColor: '#f43f5e',
            pointHoverBorderColor: '#fff',
            pointHoverBorderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: '#1a1d21',
            titleColor: '#ffffff',
            bodyColor: '#d1d5db',
            padding: 8,
            cornerRadius: 10,
            bodySpacing: 6,
            boxPadding: 10,
            boxWidth: 9,
            boxHeight: 9,
            callbacks: {
              label: (ctx) => {
                const value = ctx.parsed?.y ?? 0;
                return `${ctx.dataset.label}: S/ ${value.toLocaleString('es-PE')}`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              display: false
            },
            ticks: {
              color: '#9ca3af'
            }
          },
          y: {
            grid: {
              color: 'rgba(0,0,0,0.05)'
            },
            ticks: {
              color: '#9ca3af',
              callback: (value) => {
                return 'S/ ' + (Number(value) / 1000) + 'k';
              }
            }
          }
        }
      }
    };

    this.chart = new Chart(ctx, config);
  }
}