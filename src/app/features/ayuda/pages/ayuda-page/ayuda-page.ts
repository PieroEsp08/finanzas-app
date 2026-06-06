import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';

import {
  Network, Search, X, BookOpen, Layers, Rocket, ArrowLeftRight,
  Target, UserCircle, Wallet, Plus, Coins, AlertTriangle, Trash2,
  Download, PiggyBank, Wifi, Crown, ArrowRight, ChevronDown,
  UserCheck, MessageSquare, Mail, Users, LayoutDashboard,
  TrendingUp, TrendingDown, BarChart2, Tags
} from 'lucide-angular';

interface HelpGuide {
  title: string;
  desc: string;
  tag: string;
  icon: any;
  bg: string;
  color: string;
}

interface HelpFaq {
  id: number;
  q: string;
  a: string;
  tag: string;
  icon: any;
  bg: string;
  color: string;
}

@Component({
  selector: 'app-ayuda-page',
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './ayuda-page.html',
  styleUrl: './ayuda-page.css',
})
export class AyudaPage {

  activeHelpTag = signal<string>('todas');
  helpSearchQuery = signal<string>('');
  allFaqOpen = signal<boolean>(false);
  expandedFaqIds = signal<Set<number>>(new Set());

  icons = {
    network: Network,
    search: Search,
    close: X,
    bookOpen: BookOpen,
    arrowRight: ArrowRight,
    chevronDown: ChevronDown,
    userCheck: UserCheck,
    messageSquare: MessageSquare,
    mail: Mail,
    users: Users,
  };

  readonly filtros = [
    { valor: 'todas',         label: 'Todas',          icono: Layers,         bg: '#ecfdf5', color: '#10b981' },
    { valor: 'inicio',        label: 'Primeros pasos', icono: Rocket,         bg: '#eff6ff', color: '#3b82f6' },
    { valor: 'transacciones', label: 'Transacciones',  icono: ArrowLeftRight, bg: '#fff7ed', color: '#f97316' },
    { valor: 'metas',         label: 'Metas',          icono: Target,         bg: '#f5f3ff', color: '#7c3aed' },
    { valor: 'presupuesto',   label: 'Presupuesto',    icono: Wallet,         bg: '#ecfeff', color: '#0891b2' },
    { valor: 'cuenta',        label: 'Mi cuenta',      icono: UserCircle,     bg: '#fff5f5', color: '#e11d48' },
  ];

  readonly guias: HelpGuide[] = [
    // inicio
    { title: 'Primeros pasos en FinanzasApp',       desc: 'Aprende a configurar tu cuenta, moneda y preferencias para empezar con el pie derecho.',         tag: 'inicio',        icon: Rocket,          bg: '#eff6ff', color: '#3b82f6' },
    // transacciones
    { title: 'Registrar ingresos y gastos',          desc: 'Aprende a agregar transacciones de forma rápida y organizarlas por categoría.',                   tag: 'transacciones', icon: Plus,            bg: '#ecfdf5', color: '#10b981' },
    { title: 'Filtrar y buscar transacciones',       desc: 'Usa los filtros de fecha, categoría y tipo para encontrar cualquier movimiento al instante.',       tag: 'transacciones', icon: ArrowLeftRight,  bg: '#fff7ed', color: '#f97316' },
    // metas
    { title: 'Crear y seguir metas de ahorro',       desc: 'Establece objetivos financieros con plazos y monitorea tu avance en tiempo real.',                 tag: 'metas',         icon: Target,          bg: '#f5f3ff', color: '#8b5cf6' },
    { title: 'Abonar a una meta existente',          desc: 'Aprende cómo registrar abonos parciales y ver el progreso actualizado en cada meta.',               tag: 'metas',         icon: PiggyBank,       bg: '#f3e8ff', color: '#9333ea' },
    // presupuesto
    { title: 'Configurar presupuestos mensuales',    desc: 'Define límites de gasto por categoría y recibe alertas cuando te acerques al tope.',               tag: 'presupuesto',   icon: Wallet,          bg: '#ecfeff', color: '#0ea5e9' },
    { title: 'Interpretar los estados del presupuesto', desc: 'Entiende qué significa cada estado: Normal, En riesgo y Al límite, y cómo reaccionar.',         tag: 'presupuesto',   icon: BarChart2,       bg: '#e0f2fe', color: '#0891b2' },
    // cuenta
    { title: 'Personalizar tus categorías',          desc: 'Agrega, edita o elimina categorías con iconos y colores para mantener todo organizado.',           tag: 'cuenta',        icon: Tags,            bg: '#fff5f5', color: '#e11d48' },
  ];

  readonly faqs: HelpFaq[] = [
    { id: 1,  q: '¿Cómo cambio la moneda de mi cuenta?',            a: 'Ve a Configuración → Preferencias y selecciona tu moneda principal en el primer campo.',                              tag: 'inicio',        icon: Coins,          bg: '#fef3c7', color: '#d97706' },
    { id: 2,  q: '¿Cómo registro un ingreso o gasto?',              a: 'Desde el módulo de Finanzas o el Dashboard, pulsa el botón Nueva transacción y completa el formulario.',              tag: 'transacciones', icon: Plus,           bg: '#ecfdf5', color: '#10b981' },
    { id: 3,  q: '¿Puedo editar una transacción ya registrada?',    a: 'Sí. Busca el movimiento en el historial, pulsa el ícono de editar y modifica los campos que necesites.',             tag: 'transacciones', icon: ArrowLeftRight, bg: '#fff7ed', color: '#f97316' },
    { id: 4,  q: '¿Puedo tener más de un presupuesto activo?',      a: 'Sí, puedes crear un presupuesto por cada categoría que necesites controlar de forma independiente.',                 tag: 'presupuesto',   icon: Wallet,         bg: '#e0f2fe', color: '#0ea5e9' },
    { id: 5,  q: '¿Qué pasa si excedo mi presupuesto?',             a: 'Recibirás una notificación y el estado cambiará a Al límite mostrando el monto excedido en rojo.',                   tag: 'presupuesto',   icon: AlertTriangle,  bg: '#ffe4e6', color: '#e11d48' },
    { id: 6,  q: '¿Cómo funcionan las metas de ahorro?',            a: 'Creas una meta con un monto objetivo y fecha límite. Puedes abonar dinero gradualmente y seguir tu progreso.',       tag: 'metas',         icon: PiggyBank,      bg: '#f3e8ff', color: '#9333ea' },
    { id: 7,  q: '¿Cómo elimino una categoría que ya no uso?',      a: 'Ve a Configuración → Categorías, encuentra la categoría y pulsa el ícono de eliminar.',                              tag: 'cuenta',        icon: Trash2,         bg: '#fee2e2', color: '#ef4444' },
    { id: 8,  q: '¿Se pueden exportar mis datos financieros?',      a: 'Sí. Ve a Configuración → Preferencias → Datos y pulsa Exportar datos para descargar un archivo CSV.',               tag: 'inicio',        icon: Download,       bg: '#dcfce7', color: '#16a34a' },
    { id: 9,  q: '¿Puedo usar la app sin conexión?',                a: 'Los datos se guardan localmente, así que puedes consultar tu información offline sin problemas.',                     tag: 'inicio',        icon: Wifi,           bg: '#f1f5f9', color: '#64748b' },
    { id: 10, q: '¿Qué incluye el plan Premium?',                   a: 'Presupuestos ilimitados, analítica avanzada, exportaciones automáticas y soporte prioritario.',                      tag: 'cuenta',        icon: Crown,          bg: '#fef3c7', color: '#d97706' },
  ];

  guiasFiltradas = computed(() => {
    const tag = this.activeHelpTag();
    const query = this.helpSearchQuery().toLowerCase().trim();
    return this.guias.filter(g => {
      const matchTag = tag === 'todas' || g.tag === tag;
      const matchQuery = !query || g.title.toLowerCase().includes(query) || g.desc.toLowerCase().includes(query);
      return matchTag && matchQuery;
    });
  });

  faqsFiltradas = computed(() => {
    const tag = this.activeHelpTag();
    const query = this.helpSearchQuery().toLowerCase().trim();
    return this.faqs.filter(f => {
      const matchTag = tag === 'todas' || f.tag === tag;
      const matchQuery = !query || (f.q + ' ' + f.a).toLowerCase().includes(query);
      return matchTag && matchQuery;
    });
  });

  faqCountText = computed(() => {
    const total = this.faqsFiltradas().length;
    return `${total} ${total === 1 ? 'pregunta' : 'preguntas'}`;
  });

  setHelpTag(tag: string): void {
    this.activeHelpTag.set(tag);
    this.expandedFaqIds.set(new Set());
    this.allFaqOpen.set(false);
  }

  clearHelpSearch(): void {
    this.helpSearchQuery.set('');
  }

  toggleFaq(id: number): void {
    const current = new Set(this.expandedFaqIds());
    if (current.has(id)) {
      current.delete(id);
    } else {
      current.clear();
      current.add(id);
    }
    this.expandedFaqIds.set(current);
    this.allFaqOpen.set(current.size === this.faqsFiltradas().length && this.faqsFiltradas().length > 0);
  }

  toggleAllFaq(): void {
    const next = !this.allFaqOpen();
    this.allFaqOpen.set(next);
    this.expandedFaqIds.set(next ? new Set(this.faqsFiltradas().map(f => f.id)) : new Set());
  }
}