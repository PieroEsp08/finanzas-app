import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, ToastData } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.html',
  styleUrl: './toast.css',
})
export class Toast {
  toastService = inject(ToastService);

  cerrar(id: string): void {
    this.toastService.remove(id);
  }

  ejecutarUndo(toast: ToastData): void {
    if (toast.onUndo) {
      toast.onUndo();
    }
    this.cerrar(toast.id);
  }
}