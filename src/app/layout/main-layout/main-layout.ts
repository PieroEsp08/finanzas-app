import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from './sidebar/sidebar';
import { Header } from './header/header';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, Sidebar, Header],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout {

  // El interruptor por defecto arranca apagado (menú cerrado en celular)
  menuAbierto = false;

  // Invierte el valor (true -> false / false -> true)
  toggleMenu() {
    this.menuAbierto = !this.menuAbierto;
  }

  // Fuerza el cierre cuando tocan el fondo oscuro
  cerrarMenu() {
    this.menuAbierto = false;
  }

}
