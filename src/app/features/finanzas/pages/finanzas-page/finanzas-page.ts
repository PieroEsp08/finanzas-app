import { Component, OnInit, inject, ChangeDetectorRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';

import { TransaccionService } from '../../../../core/services/transaccion.service';
import { CategoriaService } from '../../../../core/services/categoria.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Transaccion } from '../../../../core/models/transaccion.model';
import { Categoria } from '../../../../core/models/categoria.model';

export interface TransaccionConCategoria extends Transaccion {
  categoriaObj?: Categoria;
}

@Component({
  selector: 'app-finanzas-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './finanzas-page.html',
  styleUrl: './finanzas-page.css',
})
export class FinanzasPage implements OnInit {

  // ── Servicios ─────────────────────────────────────────────────
  private readonly transaccionService = inject(TransaccionService);
  private readonly categoriaService = inject(CategoriaService);
  private readonly authService = inject(AuthService);
  private readonly cdr = inject(ChangeDetectorRef);

  // ── Estado ────────────────────────────────────────────────────
  usuarioId: string | null = null;
  cargando: boolean = false;
  error: string | null = null;

  // ── Datos ─────────────────────────────────────────────────────
  transacciones: Transaccion[] = [];
  categoriasList: Categoria[] = [];
  categoriasMap: Map<string, Categoria> = new Map();

  // ── Opciones de Filtro ─────────────────────────────────────────
  readonly registrosPorPagina = 10;

  readonly meses = [
    { valor: '',   label: 'Todos los meses' },
    { valor: '01', label: 'Enero' },
    { valor: '02', label: 'Febrero' },
    { valor: '03', label: 'Marzo' },
    { valor: '04', label: 'Abril' },
    { valor: '05', label: 'Mayo' },
    { valor: '06', label: 'Junio' },
    { valor: '07', label: 'Julio' },
    { valor: '08', label: 'Agosto' },
    { valor: '09', label: 'Septiembre' },
    { valor: '10', label: 'Octubre' },
    { valor: '11', label: 'Noviembre' },
    { valor: '12', label: 'Diciembre' },
  ];

  // ── Filtros Activos ───────────────────────────────────────────
  tipoFiltro: 'todos' | 'ingreso' | 'gasto' = 'todos';
  categoriaFiltro: string = 'todas';
  mesFiltro: string = '';
  anoFiltro: string = '';

  // ── Dropdowns UI y Paginación ─────────────────────────────────
  dropdownFiltroAbierto: boolean = false;
  dropdownMesAbierto: boolean = false;
  dropdownAnoAbierto: boolean = false;
  paginaActual: number = 1;

  // ── Lifecycle ─────────────────────────────────────────────────
  async ngOnInit(): Promise<void> {
    await this.obtenerUsuarioYCargarDatos();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('app-finanzas-page')) {
      this.dropdownFiltroAbierto = false;
      this.dropdownMesAbierto = false;
      this.dropdownAnoAbierto = false;
    }
  }

  // ── Carga de Datos ────────────────────────────────────────────
  async obtenerUsuarioYCargarDatos(): Promise<void> {
    this.cargando = true;
    this.error = null;
    this.cdr.detectChanges();

    try {
      const { data, error } = await this.authService.getCurrentUser();

      if (error || !data.user) {
        this.error = 'No hay una sesión activa de usuario.';
        this.cargando = false;
        this.cdr.detectChanges();
        return;
      }

      this.usuarioId = data.user.id;
      this.cargarDatosBackend(this.usuarioId);

    } catch (err) {
      console.error('Error al verificar sesión de Supabase:', err);
      this.error = 'Ocurrió un error al verificar la sesión.';
      this.cargando = false;
      this.cdr.detectChanges();
    }
  }

  private cargarDatosBackend(userId: string): void {
    forkJoin({
      transacciones: this.transaccionService.obtenerPorUsuario(userId),
      categorias: this.categoriaService.obtenerPorUsuario(userId),
    }).subscribe({
      next: ({ transacciones, categorias }) => {
        this.transacciones = transacciones;
        this.categoriasList = categorias;
        this.categoriasMap = new Map(categorias.map(c => [c.id!, c]));
        this.cargando = false;
        this.cdr.detectChanges(); // <- Forzamos el renderizado inmediato de la tabla
      },
      error: (err) => {
        console.error('Error al cargar transacciones o categorías:', err);
        this.error = 'No se pudieron obtener los datos del servidor.';
        this.cargando = false;
        this.cdr.detectChanges();
      },
    });
  }

  // ── Getters ───────────────────────────────────────────────────

  get anos(): string[] {
    if (!this.transacciones.length) return [];
    return [...new Set(this.transacciones.map(t => this.extraerAno(t.fecha)))]
      .filter(Boolean)
      .sort((a, b) => parseInt(b) - parseInt(a));
  }

  get categoriasFiltradasPorTipo(): (Categoria & { activa?: boolean; eliminada?: boolean })[] {
  const mapaUnico = new Map<string, Categoria & { activa?: boolean; eliminada?: boolean }>();

  // 1. Cargar las categorías activas (respetando el tipo de filtro activo)
  const categoriasActivas = this.tipoFiltro === 'todos'
    ? this.categoriasList
    : this.categoriasList.filter(c => c.tipo === this.tipoFiltro);

  categoriasActivas.forEach(c => {
    if (c.id) {
      mapaUnico.set(String(c.id), { 
        ...c, 
        activa: true, 
        eliminada: false 
      });
    }
  });

  // 2. Rescatar categorías presentes en las transacciones (incluye eliminadas/inactivas)
  for (const t of this.transacciones) {
    if (this.tipoFiltro !== 'todos' && t.tipo !== this.tipoFiltro) {
      continue;
    }

    const cat = this.getCategoria(t.categoriaId, t);
    if (cat && cat.id && !mapaUnico.has(String(cat.id))) {
      mapaUnico.set(String(cat.id), {
        ...cat,
        activa: false,     
        eliminada: true    
      });
    }
  }

  return Array.from(mapaUnico.values());
}

get labelFiltroActivo(): string {
  if (this.categoriaFiltro === 'todas') return 'Todas las categorías';

  const transaccionRelacionada = this.transacciones.find(
    t => String(t.categoriaId) === String(this.categoriaFiltro)
  );
  const cat = this.getCategoria(this.categoriaFiltro, transaccionRelacionada);

  // Muestra únicamente el emoji y el nombre limpio de la categoría
  return cat ? `${cat.emoji ? cat.emoji + ' ' : ''}${cat.nombre}` : 'Todas las categorías';
}

  get labelMesActivo(): string {
    return this.meses.find(m => m.valor === this.mesFiltro)?.label ?? 'Todos los meses';
  }

  get labelAnoActivo(): string {
    return this.anoFiltro === '' ? 'Todos los años' : this.anoFiltro;
  }

  get transaccionesConCategoria(): TransaccionConCategoria[] {
  return this.transacciones.map(t => ({
    ...t,
    categoriaObj: this.getCategoria(t.categoriaId, t),
  }));
}

  get transaccionesFiltradas(): TransaccionConCategoria[] {
    return this.transaccionesConCategoria.filter(t => {
      const matchTipo = this.tipoFiltro === 'todos' || t.tipo === this.tipoFiltro;
      const matchCategoria = this.categoriaFiltro === 'todas' || t.categoriaId === this.categoriaFiltro;
      const matchMes = this.mesFiltro === '' || this.extraerMes(t.fecha) === this.mesFiltro;
      const matchAno = this.anoFiltro === '' || this.extraerAno(t.fecha) === this.anoFiltro;
      return matchTipo && matchCategoria && matchMes && matchAno;
    });
  }

  get movimientosPaginados(): TransaccionConCategoria[] {
    const inicio = (this.paginaActual - 1) * this.registrosPorPagina;
    return this.transaccionesFiltradas.slice(inicio, inicio + this.registrosPorPagina);
  }

  get totalPaginas(): number {
    return Math.ceil(this.transaccionesFiltradas.length / this.registrosPorPagina) || 1;
  }

  get paginas(): number[] {
    return Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
  }

  get registrosMostrados(): number {
    return Math.min(this.paginaActual * this.registrosPorPagina, this.transaccionesFiltradas.length);
  }

  // ── Helpers ───────────────────────────────────────────────────

  getCategoria(categoriaId: string | number, transaccion?: any): Categoria | undefined {
  if (!categoriaId && !transaccion) return undefined;

  const idStr = String(categoriaId);

  // 1. Busca en el Map de categorías activas (buscando coincidencia estricta o string)
  if (this.categoriasMap.has(idStr)) {
    return this.categoriasMap.get(idStr);
  }
  
  // Por si los keys del Map son de tipo Number
  const catActiva = Array.from(this.categoriasMap.values()).find(c => String(c.id) === idStr);
  if (catActiva) return catActiva;

  // 2. Si fue eliminada de la lista activa pero el backend la mandó anidada en la transacción
  if (transaccion?.categoria) {
    return transaccion.categoria;
  }

  // 3. Fallback: Si el backend devolvió las propiedades mapeadas en la raíz del objeto
  if (transaccion?.categoriaNombre || transaccion?.nombreCategoria) {
    return {
      id: idStr,
      nombre: transaccion.categoriaNombre || transaccion.nombreCategoria,
      color: transaccion.categoriaColor || transaccion.colorCategoria || '#6b7280',
      emoji: transaccion.categoriaEmoji || transaccion.emojiCategoria || '🏷️'
    } as Categoria;
  }

  return undefined;
}

  private extraerMes(fecha: string): string {
    if (!fecha) return '';
    if (fecha.includes('-')) return fecha.split('-')[1];
    if (fecha.includes('/')) return fecha.split('/')[1];
    return '';
  }

  private extraerAno(fecha: string): string {
    if (!fecha) return '';
    if (fecha.includes('-')) return fecha.split('-')[0];
    if (fecha.includes('/')) return fecha.split('/')[2];
    return '';
  }

  getStyleCategoria(cat?: Categoria): { [key: string]: string } {
    if (!cat?.color) {
      return { 'background-color': '#f3f4f6', 'color': '#374151', 'border-color': '#e5e7eb' };
    }
    return {
      'background-color': `${cat.color}15`,
      'color': cat.color,
      'border-color': `${cat.color}40`
    };
  }

  // ── Controles de UI ───────────────────────────────────────────

  setTipoFiltro(tipo: 'todos' | 'ingreso' | 'gasto'): void {
    this.tipoFiltro = tipo;
    this.categoriaFiltro = 'todas';
    this.paginaActual = 1;
  }

  seleccionarFiltro(categoriaId: string): void {
    this.categoriaFiltro = categoriaId;
    this.dropdownFiltroAbierto = false;
    this.paginaActual = 1;
  }

  seleccionarMes(valor: string): void {
    this.mesFiltro = valor;
    this.dropdownMesAbierto = false;
    this.paginaActual = 1;
  }

  seleccionarAno(valor: string): void {
    this.anoFiltro = valor;
    this.dropdownAnoAbierto = false;
    this.paginaActual = 1;
  }

  cambiarPagina(pagina: number): void {
    if (pagina < 1 || pagina > this.totalPaginas) return;
    this.paginaActual = pagina;
  }
}