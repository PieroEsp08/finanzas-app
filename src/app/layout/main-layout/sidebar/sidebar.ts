import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAngularModule, LayoutDashboard, Wallet, TrendingUp, TrendingDown, PieChart, LogOut, Leaf, Settings, HelpCircle, Target, PiggyBank } from 'lucide-angular';
import { AuthService } from '../../../core/services/auth.service';


@Component({
  selector: 'app-sidebar',
  imports: [LucideAngularModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {

  private authService = inject(AuthService);
  private router = inject(Router);

  icons = {
    dashboard: LayoutDashboard,
    wallet: Wallet,
    up: TrendingUp,
    down: TrendingDown,
    report: PieChart,
    logout: LogOut,
    logo: Leaf,
    settings: Settings,
    help: HelpCircle,
    metas: Target,
    presupuesto: PiggyBank,
  };

  async cerrarSesion(): Promise<void> {
    try {
      const { error } = await this.authService.signOut();
      if (error) {
        console.error('Error al destruir la sesión en Supabase:', error.message);
        return;
      }
      
      this.router.navigate(['/auth']);
    } catch (err) {
      console.error('Error inesperado al cerrar sesión:', err);
    }
  }

}
