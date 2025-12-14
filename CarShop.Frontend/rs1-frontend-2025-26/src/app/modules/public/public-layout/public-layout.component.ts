// src/app/modules/public/public-layout/public-layout.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CurrentUserService } from '../../../core/services/auth/current-user.service';

@Component({
  selector: 'app-public-layout',
  standalone: false,
  templateUrl: './public-layout.component.html',
  styleUrl: './public-layout.component.scss',
})
export class PublicLayoutComponent {
  currentYear: string = '2025';

  // LOGIN POPUP
  isLoginOpen = false;
  isLoginClosing = false;

  // REGISTER POPUP
  isRegisterOpen = false;
  isRegisterClosing = false;

  constructor(
    private router: Router,
    private currentUser: CurrentUserService
  ) {}

  // helper za template – da li je user logovan
  get isAuthenticated(): boolean {
    return this.currentUser.isAuthenticated();
  }

  // =========================
  // LOGIN MODAL
  // =========================
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

  // =========================
  // REGISTER MODAL
  // =========================
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

  // poziva se iz <app-login> (createAccount)
  handleCreateAccountFromLogin(): void {
    // zatvori login popup
    this.isLoginOpen = false;
    this.isLoginClosing = false;

    // otvori register wizard popup
    this.openRegisterModal();
  }

  // poziva se iz <app-register> (signIn)
  handleSignInFromRegister(): void {
    this.isRegisterOpen = false;
    this.isRegisterClosing = false;

    this.openLoginModal();
  }

  // =========================
  // LOGOUT
  // =========================
  logout(): void {
    // postojeći LogoutComponent na /auth/logout ruti
    this.router.navigate(['/auth/logout']);
  }
}
