// src/app/core/guards/auth.guard.ts
import { inject } from '@angular/core';
import {
  CanActivateFn,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree
} from '@angular/router';
import { CurrentUserService } from '../services/auth/current-user.service';

export interface MyAuthRouteData {
  requireAuth?: boolean;
  requireAdmin?: boolean;
  requireManager?: boolean;
  requireEmployee?: boolean;
   /**
   * Ako je korisnik već logovan, blokira pristup ruti (npr. login/register)
   * i preusmjerava ga na njegovu defaultnu rutu.
   */
  blockWhenAuthenticated?: boolean;
}

export const myAuthGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): boolean | UrlTree => {
  const currentUser = inject(CurrentUserService);
  const router = inject(Router);

  // 🔹 ispravno čitanje data.auth
  const authData = (route.data['auth'] as MyAuthRouteData) || {};

  const requireAuth = authData.requireAuth === true;
  const blockWhenAuthenticated = authData.blockWhenAuthenticated === true;
  const requireAdmin = authData.requireAdmin === true;
  const requireManager = authData.requireManager === true;
  const requireEmployee = authData.requireEmployee === true;

  const isAuth = currentUser.isAuthenticated();

// ako je označeno da auth rute ne smiju biti dostupne logovanim korisnicima
  if (blockWhenAuthenticated && isAuth) {
    return router.parseUrl(currentUser.getDefaultRoute());
  }


  // 1) ako ruta traži auth, a user nije logiran → login + returnUrl
  if (requireAuth && !isAuth) {
    return router.createUrlTree(
      ['/auth/login'],
      {
        queryParams: {
          returnUrl: state.url // npr. /admin/orders?page=2
        }
      }
    );
  }

  // Ako ne traži auth → pusti (javne rute)
  if (!requireAuth) {
    return true;
  }

  // 2) role check – admin > manager > employee
  const user = currentUser.snapshot;
  if (!user) {
    return router.createUrlTree(['/auth/login'], {
      queryParams: { returnUrl: state.url }
    });
  }

  if (requireAdmin && !user.isAdmin) {
    return router.createUrlTree([currentUser.getDefaultRoute()]);
  }

  if (requireManager && !user.isManager) {
    return router.createUrlTree([currentUser.getDefaultRoute()]);
  }

  if (requireEmployee && !user.isEmployee) {
    return router.createUrlTree([currentUser.getDefaultRoute()]);
  }

  return true;
};

// helper za routing
export function myAuthData(data: MyAuthRouteData): { auth: MyAuthRouteData } {
  return { auth: data };
}
