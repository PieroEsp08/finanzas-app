import { Component, OnInit, inject, ChangeDetectorRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, TrendingUp, Hash, BarChart2, LucideIconData, Pencil, Trash2, FileText, Plus } from 'lucide-angular';
import { CardMetrica } from '../../../../shared/components/card-metrica/card-metrica';
import { GraficoIngresos } from '../../components/grafico-ingresos/grafico-ingresos';
import { TransaccionService } from '../../../../core/services/transaccion.service';
import { CategoriaService } from '../../../../core/services/categoria.service';
import { AuthService } from '../../../../core/services/auth.service';
import { ToastService } from '../../../../core/services/toast.service';
import { Transaccion } from '../../../../core/models/transaccion.model';
import { Categoria } from '../../../../core/models/categoria.model';

@Component({
  selector: 'app-ingresos-page',
  imports: [CommonModule, FormsModule, LucideAngularModule, CardMetrica, GraficoIngresos],
  templateUrl: './ingresos-page.html',
  styleUrl: './ingresos-page.css',
})
export class IngresosPage implements OnInit {

  // ── Servicios ─────────────────────────────────────────────────
  private transaccionService = inject(TransaccionService);
  private categoriaService = inject(CategoriaService);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private cdr = inject(ChangeDetectorRef);

  // ── Iconos ────────────────────────────────────────────────────
  readonly trendingUpIcon: LucideIconData = TrendingUp;
  readonly hashIcon: LucideIconData = Hash;
  readonly barChartIcon: LucideIconData = BarChart2;
  icons = { edit: Pencil, trash: Trash2, nota: FileText, plus: Plus };

  // ── Estado ────────────────────────────────────────────────────
  cargando = true;
  usuarioId = '';
  Math = Math;

  // ── Datos ─────────────────────────────────────────────────────
  ingresos: Transaccion[] = [];
  categorias: Categoria[] = []; // Categorías activas traídas de la API

  // ── Filtros ───────────────────────────────────────────────────
  categoriaFiltro = 'todas';
  dropdownFiltroAbierto = false;
  dropdownOrdenarAbierto = false;
  ordenActual = 'fecha-desc';

  readonly opcionesOrden = [
    { valor: 'fecha-desc', label: 'Más reciente' },
    { valor: 'fecha-asc',  label: 'Más antiguo' },
    { valor: 'monto-desc', label: 'Mayor monto' },
    { valor: 'monto-asc',  label: 'Menor monto' },
  ];

  // ── Paginación ────────────────────────────────────────────────
  paginaActual = 1;
  readonly registrosPorPagina = 5;

  // ── Modal ingreso ─────────────────────────────────────────────
  modalAbierto = false;
  dropdownModalAbierto = false;
  editandoId: string | null = null;
  nuevoConcepto = '';
  nuevoMonto: number | null = null;
  nuevaCategoria = '';
  nuevaFecha = '';
  nuevasNotas = '';

  // ── Modal nota ────────────────────────────────────────────────
  modalNotaAbierto = false;
  notaVista = '';
  conceptoNota = '';

  // ── Lifecycle ─────────────────────────────────────────────────
  async ngOnInit(): Promise<void> {
    const { data } = await this.authService.getSession();
    if (data.session) {
      this.usuarioId = data.session.user.id;
      this.cargarDatos();
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('app-ingresos-page')) {
      this.dropdownFiltroAbierto = false;
      this.dropdownOrdenarAbierto = false;
      this.dropdownModalAbierto = false;
    }
  }

  cargarDatos(): void {
    this.cargando = true;

    this.categoriaService.obtenerPorUsuarioYTipo(this.usuarioId, 'ingreso').subscribe({
      next: (cats) => { this.categorias = cats; this.cdr.detectChanges(); },
      error: (err) => console.error('Error cargando categorías:', err)
    });

    this.transaccionService.obtenerPorTipo(this.usuarioId, 'ingreso').subscribe({
      next: (data) => { this.ingresos = data; this.cargando = false; this.cdr.detectChanges(); },
      error: (err) => {
        console.error('Error cargando ingresos:', err);
        this.cargando = false;
        this.toastService.error('Error', 'No se pudieron cargar los ingresos');
        this.cdr.detectChanges();
      }
    });
  }

  // ── Getters ───────────────────────────────────────────────────
  get tituloModal(): string { return this.editandoId ? 'Editar ingreso' : 'Nuevo ingreso'; }

  /**
   * Genera dinámicamente la lista de categorías para el dropdown de FILTRADO.
   * Incluye tanto las activas como aquellas eliminadas que aún están registradas en los ingresos.
   */
  get categoriasParaFiltro(): (Categoria & { activa?: boolean })[] {
  const mapaUnico = new Map<string, Categoria & { activa?: boolean }>();

  // 1. Cargar categorías activas
  this.categorias.forEach(c => {
    if (c.id) {
      mapaUnico.set(String(c.id), { ...c, activa: true });
    }
  });

  // 2. Extraer categorías presentes en los ingresos que ya fueron eliminadas
  for (const ingreso of this.ingresos) {
    const cat = this.getCategoria(ingreso.categoriaId, ingreso);
    if (cat && cat.id && !mapaUnico.has(String(cat.id))) {
      mapaUnico.set(String(cat.id), {
        ...cat,
        activa: false // Mantener el nombre original pero marcar inactiva
      });
    }
  }

  return Array.from(mapaUnico.values());
}

  get labelFiltroActivo(): string {
    if (this.categoriaFiltro === 'todas') return 'Todas las categorías';
    const cat = this.categoriasParaFiltro.find(c => String(c.id) === String(this.categoriaFiltro));
    return cat ? `${cat.emoji ? cat.emoji + ' ' : ''}${cat.nombre}` : 'Categoría';
  }

  get labelOrdenActivo(): string {
    return this.opcionesOrden.find(o => o.valor === this.ordenActual)?.label ?? 'Ordenar';
  }

  get labelCategoriaModal(): string {
    if (!this.nuevaCategoria) return 'Seleccionar categoría';
    return this.categorias.find(c => String(c.id) === String(this.nuevaCategoria))?.nombre ?? 'Categoría';
  }

  get ingresosFiltrados(): Transaccion[] {
    let resultado = [...this.ingresos];
    if (this.categoriaFiltro !== 'todas') {
      resultado = resultado.filter(t => String(t.categoriaId) === String(this.categoriaFiltro));
    }
    switch (this.ordenActual) {
      case 'fecha-desc': resultado.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()); break;
      case 'fecha-asc':  resultado.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime()); break;
      case 'monto-desc': resultado.sort((a, b) => b.monto - a.monto); break;
      case 'monto-asc':  resultado.sort((a, b) => a.monto - b.monto); break;
    }
    return resultado;
  }

  get ingresosPaginados(): Transaccion[] {
    const inicio = (this.paginaActual - 1) * this.registrosPorPagina;
    return this.ingresosFiltrados.slice(inicio, inicio + this.registrosPorPagina);
  }

  get totalPaginas(): number { return Math.ceil(this.ingresosFiltrados.length / this.registrosPorPagina); }
  get paginas(): number[] { return Array.from({ length: this.totalPaginas }, (_, i) => i + 1); }
  get registrosMostrados(): number { return Math.min(this.paginaActual * this.registrosPorPagina, this.ingresosFiltrados.length); }
  get filasVacias(): number[] { return Array.from({ length: Math.max(this.registrosPorPagina - this.ingresosPaginados.length, 0) }, (_, i) => i); }
  get totalIngresos(): number { return this.ingresos.reduce((acc, t) => acc + t.monto, 0); }
  get totalTransacciones(): number { return this.ingresos.length; }
  get promedioPorIngreso(): number { return this.ingresos.length === 0 ? 0 : Math.round(this.totalIngresos / this.totalTransacciones); }

  // ── Helpers ───────────────────────────────────────────────────
  getCategoria(categoriaId: string | number, ingreso?: any): Categoria | undefined {
    if (!categoriaId) return undefined;

    const idStr = String(categoriaId);

    // 1. Búsqueda flexible comparando como Strings en las activas
    const catActiva = this.categorias.find(c => String(c.id) === idStr);
    if (catActiva) return catActiva;

    // 2. Si fue eliminada de la lista activa pero el backend mandó la categoría anidada
    if (ingreso?.categoria) {
      return ingreso.categoria;
    }

    // 3. Fallback: Si el backend devolvió el nombre de la categoría mapeado en el ingreso
    if (ingreso?.categoriaNombre || ingreso?.nombreCategoria) {
      return {
        id: idStr,
        nombre: ingreso.categoriaNombre || ingreso.nombreCategoria,
        color: ingreso.categoriaColor || ingreso.colorCategoria || '#6b7280',
        emoji: ingreso.categoriaEmoji || ingreso.emojiCategoria || '🏷️'
      } as Categoria;
    }

    return undefined;
  }

  // ── Acciones ──────────────────────────────────────────────────
  seleccionarFiltro(valor: string): void { this.categoriaFiltro = valor; this.dropdownFiltroAbierto = false; this.paginaActual = 1; }
  seleccionarOrden(valor: string): void { this.ordenActual = valor; this.dropdownOrdenarAbierto = false; }
  seleccionarCategoria(id: string): void { this.nuevaCategoria = id; this.dropdownModalAbierto = false; }
  cambiarPagina(pagina: number): void { if (pagina >= 1 && pagina <= this.totalPaginas) this.paginaActual = pagina; }

  abrirModal(): void {
    this.editandoId = null;
    this.resetFormulario();
    this.nuevaFecha = new Date().toISOString().split('T')[0];
    this.dropdownFiltroAbierto = false;
    this.dropdownOrdenarAbierto = false;
    this.modalAbierto = true;
  }

  abrirModalEditar(ingreso: Transaccion): void {
    this.editandoId = ingreso.id!;
    this.nuevoConcepto = ingreso.concepto;
    this.nuevoMonto = Number(ingreso.monto);
    this.nuevaCategoria = String(ingreso.categoriaId);
    this.nuevaFecha = ingreso.fecha;
    this.nuevasNotas = ingreso.notas ?? '';
    this.modalAbierto = true;
  }

  cerrarModal(): void {
    this.modalAbierto = false;
    this.editandoId = null;
    this.dropdownModalAbierto = false;
    this.resetFormulario();
  }

  resetFormulario(): void {
    this.nuevoConcepto = '';
    this.nuevoMonto = null;
    this.nuevaCategoria = '';
    this.nuevaFecha = '';
    this.nuevasNotas = '';
  }

  guardarIngreso(): void {
    if (!this.nuevoConcepto || !this.nuevoMonto || !this.nuevaFecha || !this.nuevaCategoria) {
      this.toastService.error('Campos incompletos', 'Por favor llena todos los campos obligatorios');
      return;
    }

    const ingreso: Transaccion = {
      usuarioId: this.usuarioId,
      categoriaId: this.nuevaCategoria,
      tipo: 'ingreso',
      concepto: this.nuevoConcepto,
      monto: this.nuevoMonto,
      fecha: this.nuevaFecha,
      notas: this.nuevasNotas
    };

    if (this.editandoId) {
      this.transaccionService.actualizar(this.editandoId, ingreso).subscribe({
        next: () => {
          this.cerrarModal();
          this.cargarDatos();
          this.toastService.success('Ingreso actualizado', `Se guardaron los cambios para "${ingreso.concepto}"`);
        },
        error: (err) => {
          console.error('Error actualizando ingreso:', err);
          this.toastService.error('Error al actualizar', 'No se pudieron guardar los cambios');
        }
      });
    } else {
      this.transaccionService.crear(ingreso).subscribe({
        next: () => {
          this.cerrarModal();
          this.cargarDatos();
          this.toastService.success('Ingreso registrado', `Se agregó S/ ${ingreso.monto.toLocaleString('es-PE')} correctamente`);
        },
        error: (err) => {
          console.error('Error creando ingreso:', err);
          this.toastService.error('Error al guardar', 'No se pudo registrar el ingreso');
        }
      });
    }
  }

  /**
   * Eliminación con acción reversible (Snackbar DESHACER)
   */
  abrirModalEliminar(ingreso: Transaccion): void {
    if (!ingreso.id) return;

    const idEliminar = ingreso.id;
    let cancelado = false;

    // 1. Quitarlo visualmente de la lista local
    const respaldoIngresos = [...this.ingresos];
    this.ingresos = this.ingresos.filter(t => t.id !== idEliminar);

    // 2. Disparar el Snackbar reversible de core
    this.toastService.showUndo(
      'Ingreso eliminado',
      `"${ingreso.concepto}" se eliminó del historial.`,
      () => {
        // Callback si el usuario presiona "DESHACER"
        cancelado = true;
        this.ingresos = respaldoIngresos;
        this.cdr.detectChanges();
        this.toastService.success('Acción cancelada', 'El ingreso fue restaurado');
      },
      6000
    );

    // 3. Confirmar la eliminación en la API si pasaron los 6s y no presiono DESHACER
    setTimeout(() => {
      if (!cancelado) {
        this.transaccionService.eliminar(idEliminar).subscribe({
          error: (err) => {
            console.error('Error eliminando ingreso:', err);
            this.ingresos = respaldoIngresos;
            this.toastService.error('Error', 'No se pudo eliminar el registro en el servidor');
            this.cdr.detectChanges();
          }
        });
      }
    }, 6000);
  }

  verNota(ingreso: Transaccion): void {
    this.notaVista = ingreso.notas ?? '';
    this.conceptoNota = ingreso.concepto;
    this.modalNotaAbierto = true;
  }

  cerrarModalNota(): void {
    this.modalNotaAbierto = false;
    this.notaVista = '';
    this.conceptoNota = '';
  }
}