import { Component, OnInit, inject, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginCommand } from '../../../api-services/auth/auth-api.model';
import { BaseComponent } from '../../../core/components/base-classes/base-component';
import { AuthFacadeService } from '../../../core/services/auth/auth-facade.service';
import { CurrentUserService } from '../../../core/services/auth/current-user.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent extends BaseComponent implements OnInit {
  @Input() compact: boolean = false;

  // ako je true → koristi router da otvori register (full page /auth/register),
  // ako je false → samo emituje event parentu (popup varijanta)
  @Input() openRegisterViaRouter: boolean = true;

  // parent (popup) sluša ovaj event i onda zamijeni login → register
  @Output() createAccount = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private auth = inject(AuthFacadeService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private currentUser = inject(CurrentUserService);

  hidePassword = true;
  submitted = false;
  private returnUrl: string | null = null;

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    rememberMe: [false],
  });

  ngOnInit(): void {
    // 1) probaj uzeti returnUrl iz query parametara (klasičan guard scenarij)
    const queryReturnUrl = this.route.snapshot.queryParamMap.get('returnUrl');

    // 2) alternativno probaj iz navigation state-a (ako nekad šalješ ovako)
    const navState = this.router.getCurrentNavigation()?.extras
      .state as { returnUrl?: string } | undefined;

    this.returnUrl = queryReturnUrl ?? navState?.returnUrl ?? null;
    // fallback na default rutu radimo tek POSLIJE uspješnog logina
  }

  get emailControl() {
    return this.form.get('email');
  }

  get passwordControl() {
    return this.form.get('password');
  }

  get showEmailError(): boolean {
    return !!(
      this.emailControl &&
      this.emailControl.invalid &&
      (this.emailControl.touched || this.submitted)
    );
  }

  get showEmailSuccess(): boolean {
    return !!(this.emailControl && this.emailControl.valid && this.emailControl.touched);
  }

  get showPasswordError(): boolean {
    return !!(
      this.passwordControl &&
      this.passwordControl.invalid &&
      (this.passwordControl.touched || this.submitted)
    );
  }

  get emailErrorMessage(): string {
    if (!this.emailControl) return '';
    if (this.emailControl.hasError('required')) return 'Email is required';
    if (this.emailControl.hasError('email')) return 'Enter a valid email address';
    return '';
  }

  get passwordErrorMessage(): string {
    if (!this.passwordControl) return '';
    if (this.passwordControl.hasError('required')) return 'Password is required';
    if (this.passwordControl.hasError('minlength')) return 'Use at least 6 characters';
    return '';
  }

  onCreateAccountClick(): void {
    // javi parentu (popup) da treba switch na register
    this.createAccount.emit();

    // ako smo na "pravoj" /auth/login ruti – otvori /auth/register
    if (this.openRegisterViaRouter) {
      this.router.navigate(['/auth/register']);
    }
  }

  onSubmit(): void {
    this.submitted = true;
    this.form.markAllAsTouched();

    if (this.form.invalid || this.isLoading) return;

    this.startLoading();

    const payload: LoginCommand = {
      email: (this.form.value.email ?? '').trim(),
      password: this.form.value.password ?? '',
      fingerprint: null,
    };

    this.auth.login(payload).subscribe({
      next: () => {
        this.stopLoading();

        // ako smo došli preko guarda (npr. sa /admin),
        // ideš NAZAD na taj url, inače na default rutu korisnika
        const target = this.returnUrl ?? this.currentUser.getDefaultRoute();

        // bitno: ovdje koristimo navigateByUrl jer target može biti '/admin/...'
        this.router.navigateByUrl(target);
      },
      error: (err) => {
        this.stopLoading('Invalid credentials. Please try again.');
        console.error('Login error:', err);
      },
    });
  }
}
