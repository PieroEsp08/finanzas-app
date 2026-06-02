import {Component, Input, AfterViewInit, Output, EventEmitter, ChangeDetectorRef, signal} from '@angular/core';
import { LucideAngularModule, Trash2, Calendar, Check, Plus, Pencil } from 'lucide-angular';  
  
export interface Meta {
  nombre: string;
  descripcion: string;
  actual: number;
  objetivo: number;
  color: string;
  icono: string;
  fechaLimite: string;
}

@Component({
  selector: 'app-card-meta',
  imports: [LucideAngularModule],
  templateUrl: './card-meta.html',
  styleUrl: './card-meta.css',
})
export class CardMeta implements AfterViewInit {

  @Input() meta!: Meta;

  @Output() eliminar = new EventEmitter<void>();
  @Output() abonar   = new EventEmitter<void>();
  @Output() editar   = new EventEmitter<void>();

  porcentajeAnimado = signal(0);

  readonly radius        = 38;
  readonly circunferencia = 2 * Math.PI * this.radius;

  readonly icons = {
    trash:    Trash2,
    calendar: Calendar,
    check:    Check,
    plus:     Plus,
    edit:     Pencil,
  };

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    const porcentajeFinal = this.getPorcentaje();
    let actual = 0;

    const intervalo = setInterval(() => {
      if (actual >= porcentajeFinal) {
        clearInterval(intervalo);
        return;
      }
      actual++;
      this.porcentajeAnimado.set(actual);
      this.cdr.detectChanges();
    }, 15);
  }

  getPorcentaje(): number {
    return Math.min(Math.round((this.meta.actual / this.meta.objetivo) * 100), 100);
  }

  getFaltante(): number {
    return Math.max(this.meta.objetivo - this.meta.actual, 0);
  }

  isCompletada(): boolean {
    return this.getPorcentaje() >= 100;
  }

  getColorFondo(): string {
    return this.meta.color + '12';
  }

  dashOffset(): number {
    return this.circunferencia - (this.porcentajeAnimado() / 100) * this.circunferencia;
  }
}