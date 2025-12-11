// src/app/layouts/public-layout/public-layout.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-public-layout',
  standalone: false,
  templateUrl: './public-layout.component.html',
  styleUrl: './public-layout.component.scss',
})
// public-layout.component.ts
export class PublicLayoutComponent {
  currentYear: string = '2025';

  isLoginOpen = false;
  isLoginClosing = false;

  openLoginModal(): void {
    this.isLoginClosing = false; // reset
    this.isLoginOpen = true;
  }

  closeLoginModal(): void {
    // ako već ide closing animacija, nemoj duplo
    if (this.isLoginClosing) return;

    this.isLoginClosing = true;

    // pričekaj da se animacija odradi pa tek onda sakrij popup
    setTimeout(() => {
      this.isLoginOpen = false;
      this.isLoginClosing = false;
    }, 220); // MORA se poklapati s .2s u CSS-u
  }
}
