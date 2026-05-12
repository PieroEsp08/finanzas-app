import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAngularModule, LayoutDashboard, Wallet, TrendingUp, TrendingDown, PieChart, LogOut, Leaf, Settings, HelpCircle } from 'lucide-angular';


@Component({
  selector: 'app-sidebar',
  imports: [LucideAngularModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {

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
  };

}
