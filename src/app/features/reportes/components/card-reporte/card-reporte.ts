import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, LucideIconData } from 'lucide-angular';


@Component({
  selector: 'app-card-reporte',
  imports: [CommonModule,LucideAngularModule],
  templateUrl: './card-reporte.html',
  styleUrl: './card-reporte.css',
})
export class CardReporte {

  @Input() titulo = '';
  @Input() descripcion = '';
  @Input() color = '';
  @Input() icono!: LucideIconData;

}
