import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, User, Settings, Tag } from 'lucide-angular';

import { CuentaTab } from '../../components/tabs/cuenta/cuenta-tab/cuenta-tab';
import { GeneralTab } from '../../components/tabs/general/general-tab/general-tab';
import { CategoriasTab } from '../../components/tabs/categorias/categorias-tab/categorias-tab';

@Component({
  selector: 'app-configuracion-page',
  imports: [CommonModule, LucideAngularModule, CuentaTab, GeneralTab, CategoriasTab],
  templateUrl: './configuracion-page.html',
  styleUrl: './configuracion-page.css',
})
export class ConfiguracionPage {

  tabActivo = 'cuenta';

  readonly tabs = [
    { valor: 'cuenta',      label: 'Cuenta',      icono: User },
    { valor: 'general',     label: 'General',     icono: Settings },
    { valor: 'categorias',  label: 'Categorías',  icono: Tag },
  ];

  setTab(valor: string): void {
    this.tabActivo = valor;
  }
}