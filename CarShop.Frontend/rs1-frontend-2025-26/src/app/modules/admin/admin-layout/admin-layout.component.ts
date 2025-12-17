import { Component, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthFacadeService } from '../../../core/services/auth/auth-facade.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  standalone: false,
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent {
  private translate = inject(TranslateService);
  auth = inject(AuthFacadeService);



  languages = [
    { code: 'bs', name: 'Bosanski', flag: '🇧🇦' },
    { code: 'en', name: 'English', flag: '🇬🇧' }
  ];



  constructor(private router: Router) {}
    onBack() {
      this.router.navigate(['/']);
    }

    onLogout() {
      localStorage.clear();
      this.router.navigate(['/auth/logout']);
    }


}
