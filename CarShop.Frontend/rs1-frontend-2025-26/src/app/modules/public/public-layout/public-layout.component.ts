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

  // LOGIN POPUP
  isLoginOpen = false;
  isLoginClosing = false;

  // REGISTER POPUP
  isRegisterOpen = false;
  isRegisterClosing = false;

  openLoginModal(): void {
    this.isLoginClosing = false;
    this.isLoginOpen = true;
  }

  closeLoginModal(): void {
    if (this.isLoginClosing) return;
    this.isLoginClosing = true;

    setTimeout(() => {
      this.isLoginOpen = false;
      this.isLoginClosing = false;
    }, 220);
  }

  openRegisterModal(): void {
    this.isRegisterClosing = false;
    this.isRegisterOpen = true;
  }

  closeRegisterModal(): void {
    if (this.isRegisterClosing) return;
    this.isRegisterClosing = true;

    setTimeout(() => {
      this.isRegisterOpen = false;
      this.isRegisterClosing = false;
    }, 220);
  }

  // ⬇ OVO SE POZIVA NA (createAccount) IZ LOGIN-A
  handleCreateAccountFromLogin(): void {
    // odmah zatvori login popup
    this.isLoginOpen = false;
    this.isLoginClosing = false;

    // otvori register wizard popup
    this.openRegisterModal();
  }

  handleSignInFromRegister(): void {
  // zatvori register popup
  this.isRegisterOpen = false;
  this.isRegisterClosing = false;

  // odmah otvori login popup
  this.openLoginModal();
}


}
