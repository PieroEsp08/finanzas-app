import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Pencil, Trash2 } from 'lucide-angular';
import { Categoria } from '../../../../../../../core/models/categoria.model';

@Component({
  selector: 'app-card-categoria',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './card-categoria.html',
})
export class CardCategoria {
  @Input({ required: true }) cat!: Categoria;

  // Emitimos el objeto Categoria entero para dar flexibilidad al padre
  @Output() editar = new EventEmitter<Categoria>();
  @Output() eliminar = new EventEmitter<Categoria>();

  readonly icons = { edit: Pencil, trash: Trash2 };

  onEditar(event: MouseEvent): void {
    event.stopPropagation();
    this.editar.emit(this.cat);
  }

  onEliminar(event: MouseEvent): void {
    event.stopPropagation();
    this.eliminar.emit(this.cat);
  }
}