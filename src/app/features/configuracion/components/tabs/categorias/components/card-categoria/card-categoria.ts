import { Component, Input, Output, EventEmitter } from '@angular/core';
import { LucideAngularModule, Pencil, Trash2 } from 'lucide-angular';
import { Categoria } from '../../categorias-tab/categorias-tab';

@Component({
  selector: 'app-card-categoria',
  imports: [LucideAngularModule],
  templateUrl: './card-categoria.html',
})
export class CardCategoria {
  @Input() cat!: Categoria;
  @Output() editar = new EventEmitter<number>();
  @Output() eliminar = new EventEmitter<number>();

  icons = { edit: Pencil, trash: Trash2 };
}