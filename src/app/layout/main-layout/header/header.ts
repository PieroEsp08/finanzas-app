import { Component, HostListener } from '@angular/core';
import { LucideAngularModule, Search, Bell, ChevronDown, User, CreditCard, Settings, LogOut } from 'lucide-angular';


@Component({
  selector: 'app-header',
  imports: [LucideAngularModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {

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
  };

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
    this.showProfile = false;
  }

  toggleProfile() {
    this.showProfile = !this.showProfile;
    this.showNotifications = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('app-header')) {
      this.showNotifications = false;
      this.showProfile = false;
    }
  }

}
