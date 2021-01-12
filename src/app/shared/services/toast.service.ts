import { Injectable } from '@angular/core';

interface ToastOptions {
  classname: string;
  delay?: number;
}
@Injectable({
  providedIn: 'root',
})
export class ToastService {
  toasts: any[] = [];

  show(notification: string, toastOptions?: ToastOptions) {
    this.toasts.push({ notification, ...toastOptions });
  }

  remove(toast) {
    this.toasts = this.toasts.filter((t) => t !== toast);
  }
}
