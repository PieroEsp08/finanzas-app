import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { LucideAngularModule, LucideIconData } from 'lucide-angular';

@Component({
  selector: 'app-card-metrica',
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './card-metrica.html',
  styleUrl: './card-metrica.css',
})
export class CardMetrica {

  @Input() titulo = '';

  @Input() monto = '';

  @Input() descripcion = '';

  @Input() porcentaje = '';

  @Input() icono!: LucideIconData;

  @Input() color = 'emerald';

  @Input() layout: 'grid' | 'list' = 'grid';


}
