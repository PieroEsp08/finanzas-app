import { Component, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Chart, ChartConfiguration } from 'chart.js/auto';

@Component({
  selector: 'app-grafico-gastos-categoria',
  imports: [],
  templateUrl: './grafico-gastos-categoria.html',
  styleUrl: './grafico-gastos-categoria.css',
})
export class GraficoGastosCategoria implements AfterViewInit, OnDestroy {

  @ViewChild('donutChart') donutChart!: ElementRef<HTMLCanvasElement>;

  chart!: Chart;

  readonly categorias = [
    { label: 'Alimentación',     amount: 3520, color: '#f97316' },
    { label: 'Servicios',        amount: 6579, color: '#f59e0b' },
    { label: 'Transporte',       amount: 1650, color: '#06b6d4' },
    { label: 'Entretenimiento',  amount: 580,  color: '#ec4899' },
    { label: 'Otros',            amount: 3391, color: '#8b5cf6' },
  ];

  get total(): number {
    return this.categorias.reduce((acc, c) => acc + c.amount, 0);
  }

  ngAfterViewInit(): void {
    this.initChart();
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }

  initChart() {
    const ctx = this.donutChart.nativeElement.getContext('2d');

    if (!ctx) return;

    const config: ChartConfiguration<'doughnut'> = {
      type: 'doughnut',
      data: {
        labels: this.categorias.map(c => c.label),
        datasets: [
          {
            data: this.categorias.map(c => c.amount),
            backgroundColor: this.categorias.map(c => c.color),
            borderWidth: 0,
            hoverOffset: 6,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '72%',
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: '#1a1d21',
            titleColor: '#ffffff',
            bodyColor: '#d1d5db',
            padding: 10,
            cornerRadius: 8,
            callbacks: {
              label: (ctx) => {
                const value = ctx.parsed ?? 0;
                return ` S/ ${value.toLocaleString('es-PE')}`;
              }
            }
          }
        }
      }
    };

    this.chart = new Chart(ctx, config);
  }
}