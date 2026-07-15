import { Component, HostListener, OnInit, inject, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import {
  Bell,
  ChevronDown,
  CreditCard,
  LogOut,
  LucideAngularModule,
  Search,
  Settings,
  User,
  Menu 
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
  private authService = inject(AuthService); // <-- Inyectamos el servicio de autenticación

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
    menu: Menu, 
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

  onMenuClick(): void {
    this.clickMenu.emit();
  }

  async cerrarSesion(): Promise<void> {
    try {
      const { error } = await this.authService.signOut();
      if (error) {
        console.error('Error al cerrar sesión desde el Header:', error.message);
        return;
      }
      
      this.showProfile = false;
      this.router.navigate(['/auth']); 
    } catch (err) {
      console.error('Error inesperado al cerrar sesión desde el Header:', err);
    }
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