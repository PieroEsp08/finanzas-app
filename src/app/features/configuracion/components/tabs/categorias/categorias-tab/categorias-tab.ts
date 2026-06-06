import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Plus, X } from 'lucide-angular';
import { CardCategoria } from '../components/card-categoria/card-categoria';

export interface Categoria {
  id: number;
  nombre: string;
  emoji: string;
  color: string;
  tipo: 'gasto' | 'ingreso';
  transacciones: number;
}

@Component({
  selector: 'app-categorias-tab',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, CardCategoria],
  templateUrl: './categorias-tab.html',
})
export class CategoriasTab {

  modalAbierto = false;
  editandoId: number | null = null;

  nuevoNombre = '';
  nuevoEmoji = '';
  nuevoColor = '';
  nuevoTipo: 'gasto' | 'ingreso' = 'gasto';

  icons = { plus: Plus, close: X };

  readonly emojis = [
    '🛒','🍕','🚗','🏠','💼','🎮','📱','💻','🎵','📚',
    '🏋️','✈️','💊','🐕','🎨','👕','🎁','⚡','🎬','☕',
    '🏥','🛡️','🎓','💰','📢','🔧','🍽️','🚌','🎯','💳',
  ];

  readonly colores = [
    '#f97316', '#06b6d4', '#ec4899', '#f59e0b',
    '#ef4444', '#8b5cf6', '#3b82f6', '#10b981',
    '#6b7280', '#14b8a6', '#a855f7', '#e11d48',
  ];

  categorias: Categoria[] = [
    { id: 1, nombre: 'Alimentación',    emoji: '🍕', color: '#f97316', tipo: 'gasto',   transacciones: 24 },
    { id: 2, nombre: 'Transporte',      emoji: '🚗', color: '#06b6d4', tipo: 'gasto',   transacciones: 12 },
    { id: 3, nombre: 'Entretenimiento', emoji: '🎮', color: '#ec4899', tipo: 'gasto',   transacciones: 8  },
    { id: 4, nombre: 'Servicios',       emoji: '⚡', color: '#f59e0b', tipo: 'gasto',   transacciones: 15 },
    { id: 5, nombre: 'Salud',           emoji: '🏥', color: '#ef4444', tipo: 'gasto',   transacciones: 5  },
    { id: 6, nombre: 'Educación',       emoji: '🎓', color: '#8b5cf6', tipo: 'gasto',   transacciones: 3  },
    { id: 7, nombre: 'Salario',         emoji: '💼', color: '#10b981', tipo: 'ingreso', transacciones: 8  },
    { id: 8, nombre: 'Freelance',       emoji: '💻', color: '#3b82f6', tipo: 'ingreso', transacciones: 5  },
  ];

  private nextId = 9;

  get categoriasGasto(): Categoria[] {
    return this.categorias.filter(c => c.tipo === 'gasto');
  }

  get categoriasIngreso(): Categoria[] {
    return this.categorias.filter(c => c.tipo === 'ingreso');
  }

  get titulo(): string {
    return this.editandoId !== null ? 'Editar categoría' : 'Nueva categoría';
  }

  abrirModal(target?: number | 'gasto' | 'ingreso'): void {
    this.modalAbierto = true;

    if (typeof target === 'number') {
      const cat = this.categorias.find(c => c.id === target);
      if (cat) {
        this.editandoId = target;
        this.nuevoNombre = cat.nombre;
        this.nuevoEmoji = cat.emoji;
        this.nuevoColor = cat.color;
        this.nuevoTipo = cat.tipo;
      }
    } else {
      this.resetFormulario();
      if (target) this.nuevoTipo = target;
    }
  }

  cerrarModal(): void {
    this.modalAbierto = false;
    this.resetFormulario();
  }

  resetFormulario(): void {
    this.editandoId = null;
    this.nuevoNombre = '';
    this.nuevoEmoji = '';
    this.nuevoColor = '';
    this.nuevoTipo = 'gasto';
  }

  guardar(): void {
    if (!this.nuevoNombre || !this.nuevoEmoji || !this.nuevoColor) return;

    if (this.editandoId !== null) {
      const cat = this.categorias.find(c => c.id === this.editandoId);
      if (cat) {
        cat.nombre = this.nuevoNombre;
        cat.emoji = this.nuevoEmoji;
        cat.color = this.nuevoColor;
        cat.tipo = this.nuevoTipo;
      }
    } else {
      this.categorias.push({
        id: this.nextId++,
        nombre: this.nuevoNombre,
        emoji: this.nuevoEmoji,
        color: this.nuevoColor,
        tipo: this.nuevoTipo,
        transacciones: 0,
      });
    }
    this.cerrarModal();
  }

  eliminar(id: number): void {
    this.categorias = this.categorias.filter(c => c.id !== id);
  }
}