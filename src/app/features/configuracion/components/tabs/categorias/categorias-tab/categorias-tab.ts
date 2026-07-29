import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Plus, X } from 'lucide-angular';
import { CardCategoria } from '../components/card-categoria/card-categoria';

import { CategoriaService } from '../../../../../../core/services/categoria.service';
import { AuthService } from '../../../../../../core/services/auth.service';
import { ToastService } from '../../../../../../core/services/toast.service';
import { Categoria } from '../../../../../../core/models/categoria.model';

@Component({
  selector: 'app-categorias-tab',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, CardCategoria],
  templateUrl: './categorias-tab.html',
})
export class CategoriasTab implements OnInit {

  // ── Servicios ─────────────────────────────────────────────────
  private readonly categoriaService = inject(CategoriaService);
  private readonly authService = inject(AuthService);
  private readonly toastService = inject(ToastService);
  private readonly cdr = inject(ChangeDetectorRef);

  // ── Iconos ────────────────────────────────────────────────────
  readonly icons = { plus: Plus, close: X, x: X };

  // ── Estado ────────────────────────────────────────────────────
  cargando = true;
  usuarioId = '';
  modalAbierto = false;
  editandoId: string | null = null;

  // ── Formulario ────────────────────────────────────────────────
  nuevoNombre = '';
  nuevoEmoji = '';
  nuevoColor = '';
  nuevoTipo: 'gasto' | 'ingreso' = 'gasto';

  readonly emojis = [
  '💵', // Efectivo / Cobros
  '💻', // Freelance / Proyectos
  '🎁', // Regalos / Bonos / Premios
  '🏢', // Arriendos recibidos / Propiedades
  '💳', // Tarjetas / Cobros digitales

  '🛒', // Supermercado / Compras hogar
  '🍕', // Comida rápida / Restaurantes
  '☕', // Café / Desayunos / Snacks
  '🍿', // Cine / Snacks / Pelis (canchita)
  '🍺', // Bares / Salidas
  '🐕', // Mascotas / Veterinaria

  '⛽', // Gasolina / Combustible
  '🚌', // Transporte público / Metro
  '✈️', // Viajes / Pasajes
  '📱', // Teléfono / Plan celular
  '🛠️', // Reparaciones / Mantenimiento

  '🏋️', // Gimnasio / Deportes
  '🎬', // Streaming / Eventos / Conciertos
  '👕', // Ropa / Calzado / Moda
  '✂️', // Peluquería / Estética
  '🧴', // Higiene / Aseo personal
];

  readonly colores = [
  // Fila 1: Verdes y Teales (Nuevas entradas / Ahorros)
  '#059669', // Emerald 600 (Verde bosque)
  '#22c55e', // Green 500   (Verde lima brillante)
  '#84cc16', // Lime 500    (Verde oliva / Lima)
  '#14b8a6', // Teal 500    (Turquesa)
  '#0f766e', // Teal 700    (Verde azulado oscuro)

  // Fila 2: Azules e Índigos (Servicios / Transporte / Hogar)
  '#0891b2', // Cyan 600    (Cian profundo)
  '#0284c7', // Sky 600     (Azul cielo)
  '#1d4ed8', // Blue 700    (Azul cobalto intenso)
  '#6366f1', // Indigo 500  (Índigo)
  '#4338ca', // Indigo 700  (Azul noche)

  // Fila 3: Púrpuras, Fucsias y Rosas (Estilo de vida / Compras)
  '#7c3aed', // Violet 600  (Violeta intenso)
  '#c026d3', // Fuchsia 600 (Fucsia oscuro)
  '#d946ef', // Fuchsia 500 (Fucsia brillante)
  '#e11d48', // Rose 600    (Rojo carmesí)
  '#f43f5e', // Rose 500    (Rosa coral)

  // Fila 4: Naranjas, Ámbar y Neutros (Ocio / Gastos varios)
  '#ea580c', // Orange 600  (Naranja ladrillo)
  '#d97706', // Amber 600   (Ámbar cálido / Dorado)
  '#ca8a04', // Yellow 600  (Mostaza)
  '#64748b', // Slate 500   (Gris pizarra)
  '#475569', // Slate 600   (Gris plomo oscuro)
];

  // ── Datos ─────────────────────────────────────────────────────
  categorias: Categoria[] = [];

  // ── Lifecycle ─────────────────────────────────────────────────
  async ngOnInit(): Promise<void> {
    await this.obtenerUsuarioYCargarDatos();
  }

  // ── Carga de Datos ────────────────────────────────────────────
  async obtenerUsuarioYCargarDatos(): Promise<void> {
    this.cargando = true;
    this.cdr.detectChanges();

    try {
      const { data, error } = await this.authService.getCurrentUser();

      if (error || !data.user) {
        this.toastService.error('Sesión inválida', 'No se pudo identificar al usuario');
        this.cargando = false;
        this.cdr.detectChanges();
        return;
      }

      this.usuarioId = data.user.id;
      this.cargarCategorias();

    } catch (err) {
      console.error('Error al obtener usuario:', err);
      this.cargando = false;
      this.cdr.detectChanges();
    }
  }

  cargarCategorias(): void {
    this.categoriaService.obtenerPorUsuario(this.usuarioId).subscribe({
      next: (data) => {
        this.categorias = data;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando categorías:', err);
        this.toastService.error('Error', 'No se pudieron cargar las categorías');
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  // ── Getters ───────────────────────────────────────────────────
  get categoriasGasto(): Categoria[] {
    return this.categorias.filter(c => c.tipo === 'gasto');
  }

  get categoriasIngreso(): Categoria[] {
    return this.categorias.filter(c => c.tipo === 'ingreso');
  }

  get titulo(): string {
    return this.editandoId !== null ? 'Editar categoría' : 'Nueva categoría';
  }

  // ── Acciones Modal ────────────────────────────────────────────
  abrirModal(target?: string | 'gasto' | 'ingreso' | Categoria): void {
    if (typeof target === 'object' && target !== null) {
      // 🛑 Bloqueo para categorías por defecto
      if (target.esDefault) {
        this.toastService.error('Acción no permitida', 'Las categorías del sistema no se pueden editar');
        return;
      }

      this.editandoId = target.id ?? null;
      this.nuevoNombre = target.nombre;
      this.nuevoEmoji = target.emoji ?? '';
      this.nuevoColor = target.color ?? '';
      this.nuevoTipo = target.tipo;
      this.modalAbierto = true;

    } else if (typeof target === 'string' && target !== 'gasto' && target !== 'ingreso') {
      const cat = this.categorias.find(c => c.id === target);
      if (cat) {
        // 🛑 Bloqueo para categorías por defecto
        if (cat.esDefault) {
          this.toastService.error('Acción no permitida', 'Las categorías del sistema no se pueden editar');
          return;
        }

        this.editandoId = cat.id ?? null;
        this.nuevoNombre = cat.nombre;
        this.nuevoEmoji = cat.emoji ?? '';
        this.nuevoColor = cat.color ?? '';
        this.nuevoTipo = cat.tipo;
        this.modalAbierto = true;
      }

    } else {
      // Crear nueva categoría
      this.resetFormulario();
      if (target === 'gasto' || target === 'ingreso') {
        this.nuevoTipo = target;
      }
      this.modalAbierto = true;
    }

    this.cdr.detectChanges();
  }

  cerrarModal(): void {
    this.modalAbierto = false;
    this.resetFormulario();
    this.cdr.detectChanges();
  }

  resetFormulario(): void {
    this.editandoId = null;
    this.nuevoNombre = '';
    this.nuevoEmoji = '';
    this.nuevoColor = '';
    this.nuevoTipo = 'gasto';
  }

  // ── Operaciones CRUD ──────────────────────────────────────────
  guardar(): void {
    if (!this.nuevoNombre.trim() || !this.nuevoEmoji || !this.nuevoColor) {
      this.toastService.error('Campos incompletos', 'Por favor llena todos los campos');
      return;
    }

    const payload: Categoria = {
      usuarioId: this.usuarioId,
      nombre: this.nuevoNombre.trim(),
      emoji: this.nuevoEmoji,
      color: this.nuevoColor,
      tipo: this.nuevoTipo,
      esDefault: false // 👈 Las categorías creadas por el usuario siempre son custom
    };

    if (this.editandoId !== null) {
      // Actualizar
      this.categoriaService.actualizar(this.editandoId, payload).subscribe({
        next: () => {
          this.cerrarModal();
          this.cargarCategorias();
          this.toastService.success('Categoría actualizada', `Se guardaron los cambios para "${payload.nombre}"`);
        },
        error: (err) => {
          console.error('Error actualizando categoría:', err);
          this.toastService.error('Error al actualizar', 'No se pudieron guardar los cambios');
        }
      });
    } else {
      // Crear
      this.categoriaService.crear(payload).subscribe({
        next: () => {
          this.cerrarModal();
          this.cargarCategorias();
          this.toastService.success('Categoría creada', `Se registró la categoría "${payload.nombre}"`);
        },
        error: (err) => {
          console.error('Error creando categoría:', err);
          this.toastService.error('Error al guardar', 'No se pudo crear la categoría');
        }
      });
    }
  }

  eliminar(id: string | Categoria): void {
    const catObj = typeof id === 'object' ? id : this.categorias.find(c => c.id === id);
    if (!catObj || !catObj.id) return;

    // 🛑 Bloqueo para categorías por defecto
    if (catObj.esDefault) {
      this.toastService.error('Acción no permitida', 'Las categorías del sistema no se pueden eliminar');
      return;
    }

    this.categoriaService.eliminar(catObj.id).subscribe({
      next: () => {
        this.cargarCategorias();
        this.toastService.success('Categoría eliminada', `"${catObj.nombre}" fue eliminada correctamente`);
      },
      error: (err) => {
        console.error('Error eliminando categoría:', err);
        this.toastService.error(
          'Error al eliminar',
          'No se pudo eliminar la categoría. Verifica que no tenga movimientos asociados.'
        );
      }
    });
  }
}