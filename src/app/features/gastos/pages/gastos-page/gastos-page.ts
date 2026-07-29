import { Component, OnInit, inject, ChangeDetectorRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, TrendingDown, Hash, BarChart2, LucideIconData, Pencil, Trash2, FileText, Plus } from 'lucide-angular';
import { CardMetrica } from '../../../../shared/components/card-metrica/card-metrica';
import { GraficoGastos } from '../../components/grafico-gastos/grafico-gastos';
import { TransaccionService } from '../../../../core/services/transaccion.service';
import { CategoriaService } from '../../../../core/services/categoria.service';
import { AuthService } from '../../../../core/services/auth.service';
import { ToastService } from '../../../../core/services/toast.service';
import { Transaccion } from '../../../../core/models/transaccion.model';
import { Categoria } from '../../../../core/models/categoria.model';

@Component({
  selector: 'app-gastos-page',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, CardMetrica, GraficoGastos],
  templateUrl: './gastos-page.html',
  styleUrl: './gastos-page.css',
})
export class GastosPage implements OnInit {

  // ── Servicios ─────────────────────────────────────────────────
  private transaccionService = inject(TransaccionService);
  private categoriaService = inject(CategoriaService);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private cdr = inject(ChangeDetectorRef);

  // ── Iconos ────────────────────────────────────────────────────
  readonly trendingDownIcon: LucideIconData = TrendingDown;
  readonly hashIcon: LucideIconData = Hash;
  readonly barChartIcon: LucideIconData = BarChart2;
  icons = { edit: Pencil, trash: Trash2, nota: FileText, plus: Plus };

  // ── Estado ────────────────────────────────────────────────────
  cargando = true;
  usuarioId = '';
  Math = Math;

  // ── Datos ─────────────────────────────────────────────────────
  gastos: Transaccion[] = [];
  categorias: Categoria[] = [];

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

  // ── Modal gasto ───────────────────────────────────────────────
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
    if (!target.closest('app-gastos-page')) {
      this.dropdownFiltroAbierto = false;
      this.dropdownOrdenarAbierto = false;
      this.dropdownModalAbierto = false;
    }
  }

  cargarDatos(): void {
    this.cargando = true;

    this.categoriaService.obtenerPorUsuarioYTipo(this.usuarioId, 'gasto').subscribe({
      next: (cats) => { 
        this.categorias = cats; 
        this.cdr.detectChanges(); 
      },
      error: (err) => console.error('Error cargando categorías:', err)
    });

    this.transaccionService.obtenerPorTipo(this.usuarioId, 'gasto').subscribe({
      next: (data) => { 
        this.gastos = data; 
        this.cargando = false; 
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        console.error('Error cargando gastos:', err);
        this.cargando = false;
        this.toastService.error('Error', 'No se pudieron cargar los gastos');
        this.cdr.detectChanges();
      }
    });
  }

  // ── Getters ───────────────────────────────────────────────────
  get tituloModal(): string { return this.editandoId ? 'Editar gasto' : 'Nuevo gasto'; }

  /**
 * Genera dinámicamente la lista de categorías para el dropdown de FILTRADO.
 * Incluye tanto las activas como aquellas eliminadas que aún están registradas en los gastos.
 */
get categoriasParaFiltro(): (Categoria & { activa?: boolean })[] {
  const mapaUnico = new Map<string, Categoria & { activa?: boolean }>();

  // 1. Cargar categorías activas
  this.categorias.forEach(c => {
    if (c.id) {
      mapaUnico.set(String(c.id), { ...c, activa: true });
    }
  });

  // 2. Extraer y rescatar categorías presentes en los gastos (incluye inactivas/eliminadas)
  for (const gasto of this.gastos) {
    const cat = this.getCategoria(gasto.categoriaId, gasto);
    if (cat && cat.id && !mapaUnico.has(String(cat.id))) {
      mapaUnico.set(String(cat.id), {
        ...cat,
        activa: false // <--- Conserva su nombre y marca la bandera
      });
    }
  }

  return Array.from(mapaUnico.values());
}

  get labelFiltroActivo(): string {
    if (this.categoriaFiltro === 'todas') return 'Todas las categorías';
    return this.categorias.find(c => c.id === this.categoriaFiltro)?.nombre ?? 'Categoría';
  }

  get labelOrdenActivo(): string {
    return this.opcionesOrden.find(o => o.valor === this.ordenActual)?.label ?? 'Ordenar';
  }

  get labelCategoriaModal(): string {
    if (!this.nuevaCategoria) return 'Seleccionar categoría';
    return this.categorias.find(c => c.id === this.nuevaCategoria)?.nombre ?? 'Categoría';
  }

  get gastosFiltrados(): Transaccion[] {
    let resultado = [...this.gastos];
    if (this.categoriaFiltro !== 'todas') {
      resultado = resultado.filter(t => t.categoriaId === this.categoriaFiltro);
    }
    switch (this.ordenActual) {
      case 'fecha-desc': resultado.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()); break;
      case 'fecha-asc':  resultado.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime()); break;
      case 'monto-desc': resultado.sort((a, b) => b.monto - a.monto); break;
      case 'monto-asc':  resultado.sort((a, b) => a.monto - b.monto); break;
    }
    return resultado;
  }

  get gastosPaginados(): Transaccion[] {
    const inicio = (this.paginaActual - 1) * this.registrosPorPagina;
    return this.gastosFiltrados.slice(inicio, inicio + this.registrosPorPagina);
  }

  get totalPaginas(): number { return Math.ceil(this.gastosFiltrados.length / this.registrosPorPagina); }
  get paginas(): number[] { return Array.from({ length: this.totalPaginas }, (_, i) => i + 1); }
  get registrosMostrados(): number { return Math.min(this.paginaActual * this.registrosPorPagina, this.gastosFiltrados.length); }
  get filasVacias(): number[] { return Array.from({ length: Math.max(this.registrosPorPagina - this.gastosPaginados.length, 0) }, (_, i) => i); }
  get totalGastos(): number { return this.gastos.reduce((acc, t) => acc + t.monto, 0); }
  get totalTransacciones(): number { return this.gastos.length; }
  get promedioPorGasto(): number { return this.gastos.length === 0 ? 0 : Math.round(this.totalGastos / this.totalTransacciones); }

  // ── Helpers ───────────────────────────────────────────────────
getCategoria(categoriaId: string | number, gasto?: any): Categoria | undefined {
  if (!categoriaId) return undefined;

  // 1. Busca en las categorías activas (comparando como String por compatibilidad de tipos/UUIDs)
  const catActiva = this.categorias.find(c => String(c.id) === String(categoriaId));
  if (catActiva) return catActiva;

  // 2. Si fue eliminada de la lista activa pero el backend la mandó anidada en la transacción
  if (gasto?.categoria) {
    return gasto.categoria;
  }

  // 3. Fallback: Si el backend devolvió las propiedades mapeadas en la raíz del objeto
  if (gasto?.categoriaNombre || gasto?.nombreCategoria) {
    return {
      id: String(categoriaId),
      nombre: gasto.categoriaNombre || gasto.nombreCategoria,
      color: gasto.categoriaColor || gasto.colorCategoria || '#ef4444',
      emoji: gasto.categoriaEmoji || gasto.emojiCategoria || '🏷️'
    } as Categoria;
  }

  return undefined;
}

  // ── Acciones ──────────────────────────────────────────────────
  seleccionarFiltro(valor: string | undefined): void {
    if (!valor) return;
    this.categoriaFiltro = valor;
    this.dropdownFiltroAbierto = false;
    this.paginaActual = 1;
  }

  seleccionarOrden(valor: string): void {
    this.ordenActual = valor;
    this.dropdownOrdenarAbierto = false;
  }

  seleccionarCategoria(id: string | undefined): void {
    if (!id) return;
    this.nuevaCategoria = id;
    this.dropdownModalAbierto = false;
  }

  cambiarPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPaginas) this.paginaActual = pagina;
  }

  abrirModal(): void {
    this.editandoId = null;
    this.resetFormulario();
    this.nuevaFecha = new Date().toISOString().split('T')[0];
    this.dropdownFiltroAbierto = false;
    this.dropdownOrdenarAbierto = false;
    this.modalAbierto = true;
  }

  abrirModalEditar(gasto: Transaccion): void {
    this.editandoId = gasto.id!;
    this.nuevoConcepto = gasto.concepto;
    this.nuevoMonto = Number(gasto.monto);
    this.nuevaCategoria = gasto.categoriaId;
    this.nuevaFecha = gasto.fecha;
    this.nuevasNotas = gasto.notas ?? '';
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

  guardarGasto(): void {
    if (!this.nuevoConcepto || !this.nuevoMonto || !this.nuevaFecha || !this.nuevaCategoria) {
      this.toastService.error('Campos incompletos', 'Por favor llena todos los campos obligatorios');
      return;
    }

    const gasto: Transaccion = {
      usuarioId: this.usuarioId,
      categoriaId: this.nuevaCategoria,
      tipo: 'gasto',
      concepto: this.nuevoConcepto,
      monto: this.nuevoMonto,
      fecha: this.nuevaFecha,
      notas: this.nuevasNotas
    };

    if (this.editandoId) {
      this.transaccionService.actualizar(this.editandoId, gasto).subscribe({
        next: () => {
          this.cerrarModal();
          this.cargarDatos();
          this.toastService.success('Gasto actualizado', `Se guardaron los cambios para "${gasto.concepto}"`);
        },
        error: (err) => {
          console.error('Error actualizando gasto:', err);
          this.toastService.error('Error al actualizar', 'No se pudieron guardar los cambios');
        }
      });
    } else {
      this.transaccionService.crear(gasto).subscribe({
        next: () => {
          this.cerrarModal();
          this.cargarDatos();
          this.toastService.success('Gasto registrado', `Se registró el gasto de S/ ${gasto.monto.toLocaleString('es-PE')} correctamente`);
        },
        error: (err) => {
          console.error('Error creando gasto:', err);
          this.toastService.error('Error al guardar', 'No se pudo registrar el gasto');
        }
      });
    }
  }

  abrirModalEliminar(gasto: Transaccion): void {
    if (!gasto.id) return;

    const idEliminar = gasto.id;
    let cancelado = false;

    // 1. Quitarlo visualmente de la lista local
    const respaldoGastos = [...this.gastos];
    this.gastos = this.gastos.filter(t => t.id !== idEliminar);
    this.cdr.detectChanges();

    // 2. Disparar el Snackbar reversible
    this.toastService.showUndo(
      'Gasto eliminado',
      `"${gasto.concepto}" se eliminó del historial.`,
      () => {
        cancelado = true;
        this.gastos = respaldoGastos;
        this.cdr.detectChanges();
        this.toastService.success('Acción cancelada', 'El gasto fue restaurado');
      },
      6000
    );

    // 3. Confirmar eliminación en la API
    setTimeout(() => {
      if (!cancelado) {
        this.transaccionService.eliminar(idEliminar).subscribe({
          error: (err) => {
            console.error('Error eliminando gasto:', err);
            this.gastos = respaldoGastos;
            this.toastService.error('Error', 'No se pudo eliminar el registro en el servidor');
            this.cdr.detectChanges();
          }
        });
      }
    }, 6000);
  }

  verNota(gasto: Transaccion): void {
    this.notaVista = gasto.notas ?? '';
    this.conceptoNota = gasto.concepto;
    this.modalNotaAbierto = true;
  }

  cerrarModalNota(): void {
    this.modalNotaAbierto = false;
    this.notaVista = '';
    this.conceptoNota = '';
  }
}