import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, inject } from '@angular/core';
import { Router } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { AuthFacadeService } from '../../../core/services/auth/auth-facade.service';

@Component({
  selector: 'app-logout',
  standalone: false,
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.scss',
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('260ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
  ],
})
export class LogoutComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private auth = inject(AuthFacadeService);

  @Input() redirectToLogin = true;
  @Input() compact = false;
  @Output() completed = new EventEmitter<void>();

  totalSeconds = 2;
  countdownSeconds = this.totalSeconds;

  progressActive = false;

  private countdownTimerId: any = null;

  ngOnInit(): void {
    // reset (ako component nekad ostane u DOM-u)
    this.countdownSeconds = this.totalSeconds;
    this.progressActive = false;

    // logout: API + clear local state (tvoja facade to radi)
    this.auth.logout().subscribe({
      next: () => this.startCountdown(),
      error: () => this.startCountdown(),
    });
  }

  ngOnDestroy(): void {
    if (this.countdownTimerId) {
      clearInterval(this.countdownTimerId);
      this.countdownTimerId = null;
    }
  }

  private startCountdown(): void {
    // pokreni progress animaciju tek sad (da ne krene prije API-a)
    this.progressActive = true;

    this.countdownTimerId = setInterval(() => {
      this.countdownSeconds--;

      if (this.countdownSeconds <= 0) {
        clearInterval(this.countdownTimerId);
        this.countdownTimerId = null;

        this.completed.emit();

        if (this.redirectToLogin) {
          this.router.navigate(['/login']);
        }
      }
    }, 1000);
  }
}
