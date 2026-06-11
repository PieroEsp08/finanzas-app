import { Component, HostListener, OnInit, inject, Output, EventEmitter } from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router
} from '@angular/router';
import {
  Bell,
  ChevronDown,
  CreditCard,
  LogOut,
  LucideAngularModule,
  Search,
  Settings,
  User,
  Menu // 1. Agregamos el icono de menú
} from 'lucide-angular';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  imports: [LucideAngularModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit {

  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  // 2. Declaramos la salida para conectar con el MainLayout
  @Output() clickMenu = new EventEmitter<void>();

  tituloHeader = 'FinanzasApp';
  subtituloHeader = 'Gestiona tu dinero';

  showNotifications = false;
  showProfile = false;

  icons = {
    search: Search,
    bell: Bell,
    chevron: ChevronDown,
    user: User,
    creditCard: CreditCard,
    settings: Settings,
    logout: LogOut,
    menu: Menu, // 3. Registramos el icono en tu lista
  };

  ngOnInit(): void {
    this.actualizarHeader();

    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe(() => {
        this.actualizarHeader();
      });
  }

  // 4. Método que gatilla el grito hacia el Layout principal
  onMenuClick(): void {
    this.clickMenu.emit();
  }

  private actualizarHeader(): void {
    let route = this.activatedRoute.root;
    while (route.firstChild) {
      route = route.firstChild;
    }
    const data = route.snapshot.data;
    this.tituloHeader = data['titulo'] ?? 'FinanzasApp';
    this.subtituloHeader = data['subtitulo'] ?? 'Gestiona tu dinero';
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
    this.showProfile = false;
  }

  toggleProfile(): void {
    this.showProfile = !this.showProfile;
    this.showNotifications = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('app-header')) {
      this.showNotifications = false;
      this.showProfile = false;
    }
  }
}