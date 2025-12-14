// src/app/core/services/auth/current-user.service.ts
import { Injectable, inject, computed } from '@angular/core';
import { AuthFacadeService } from './auth-facade.service';

@Injectable({ providedIn: 'root' })
export class CurrentUserService {
  private auth = inject(AuthFacadeService);

  /** Signal koji UI može čitati (readonly) */
  currentUser = computed(() => this.auth.currentUser());

  isAuthenticated = computed(() => this.auth.isAuthenticated());
  isAdmin = computed(() => this.auth.isAdmin());
  isManager = computed(() => this.auth.isManager());
  isEmployee = computed(() => this.auth.isEmployee());

  get snapshot() {
    return this.auth.currentUser();
  }

  /** Pravilo: admin > manager > employee → client */
getDefaultRoute(): string {
  const user = this.snapshot;

  // niko nije logovan → login stranica
  if (!user) {
    return '/auth/login';
  }

  // admin ide na admin dio
  if (user.isAdmin) {
    return '/admin';
  }

  // ako imaš manager rolu i poseban dio za nju, stavi ovdje npr. '/admin'
  if (user.isManager) {
    return '/admin';
  }

  // svi ostali logirani idu na public dio
  if (user.isEmployee) {
    return '/public';
  }

  // fallback
  return '/public';
}

}
