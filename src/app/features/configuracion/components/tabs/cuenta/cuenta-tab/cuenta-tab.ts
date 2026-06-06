import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  LucideAngularModule,
  Camera, Crown, Lock,
  ShieldCheck, X, Eye, EyeOff
} from 'lucide-angular';

@Component({
  selector: 'app-cuenta-tab',
  imports: [FormsModule, LucideAngularModule],
  templateUrl: './cuenta-tab.html',
  styleUrl: './cuenta-tab.css',
})
export class CuentaTab {

  pinActivo = true;
  mostrarModal = false;
  mostrarModalPin = false;
  tienePinGuardado = true;
  pasoModalPin: 1 | 2 = 1;

  verPasswordActual = false;
  verNuevaPassword = false;
  passwordActual = '';
  nuevaPassword = '';

  pinViejoInputs: string[] = ['', '', '', ''];
  pinInputs: string[] = ['', '', '', ''];

  icons = {
    camera: Camera, crown: Crown, lock: Lock,
    shield: ShieldCheck, x: X, eye: Eye, eyeOff: EyeOff
  };

  perfil = {
    nombre: 'Usuario',
    email: 'usuario@gmail.com',
    telefono: '999999999',
    fechaNacimiento: '1996-10-05',
    ocupacion: 'Programador',
    ubicacion: 'Lima, Perú',
  };

  guardarCambios(): void {
    console.log('Perfil actualizado:', this.perfil);
  }

  abrirModal(): void {
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.passwordActual = '';
    this.nuevaPassword = '';
    this.verPasswordActual = false;
    this.verNuevaPassword = false;
  }

  procesarChangePassword(): void {
    console.log('Contraseña actualizada:', { actual: this.passwordActual, nueva: this.nuevaPassword });
    this.cerrarModal();
  }

  togglePinSwitch(): void {
    this.pinActivo = !this.pinActivo;
    if (this.pinActivo) {
      this.clearPinInputs();
      this.pasoModalPin = 2;
      this.mostrarModalPin = true;
    } else {
      this.clearPinInputs();
      this.tienePinGuardado = false;
    }
  }

  abrirModalPin(): void {
    this.clearPinInputs();
    this.pasoModalPin = 1;
    this.mostrarModalPin = true;
  }

  cerrarModalPin(): void {
    this.mostrarModalPin = false;
    if (this.pasoModalPin === 2 && !this.tienePinGuardado) {
      this.pinActivo = false;
    }
    this.clearPinInputs();
  }

  clearPinInputs(): void {
    this.pinInputs = ['', '', '', ''];
    this.pinViejoInputs = ['', '', '', ''];
  }

  isPinCompleto(): boolean {
    const inputs = this.pasoModalPin === 1 ? this.pinViejoInputs : this.pinInputs;
    return inputs.every(val => val !== '' && !isNaN(Number(val)));
  }

  onPinInput(index: number, nextInput: HTMLInputElement | null, event: Event): void {
    const element = event.target as HTMLInputElement;
    const inputs = this.pasoModalPin === 1 ? this.pinViejoInputs : this.pinInputs;
    if (element.value && isNaN(Number(element.value))) {
      inputs[index] = '';
      return;
    }
    if (element.value && nextInput) nextInput.focus();
  }

  onPinKeyDown(index: number, prevInput: HTMLInputElement | null, event: KeyboardEvent): void {
    const inputs = this.pasoModalPin === 1 ? this.pinViejoInputs : this.pinInputs;
    if (event.key === 'Backspace' && !inputs[index] && prevInput) prevInput.focus();
  }

  avanzarOProcesarPin(): void {
    if (this.pasoModalPin === 1) {
      console.log('Validando PIN anterior...', this.pinViejoInputs.join(''));
      this.pasoModalPin = 2;
    } else {
      console.log('Nuevo PIN guardado:', this.pinInputs.join(''));
      this.tienePinGuardado = true;
      this.mostrarModalPin = false;
    }
  }
}