// src/app/modules/auth/login/login.component.ts
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  inject,
} from '@angular/core';
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
  private fb = inject(FormBuilder);
  private auth = inject(AuthFacadeService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private currentUser = inject(CurrentUserService);

  // za public popup
  @Input() compact = false;
  @Input() openRegisterViaRouter = true;
  @Output() createAccount = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();

  hidePassword = true;
  submitted = false;

  form = this.fb.group({
    email: ['admin@carshop.local', [Validators.required, Validators.email]],
    password: ['Admin123!', [Validators.required, Validators.minLength(6)]],
    rememberMe: [false],
  });

  ngOnInit(): void {
    // više NE računamo returnUrl ovdje,
    // samo eventualno možeš ostaviti prazan hook
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

        // 🔑 VAŽNO: target određujemo TEK SADA, kad je user već logovan
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
        const target = returnUrl || this.currentUser.getDefaultRoute();

        // ako si došao sa čuvene returnUrl=/admin/... rute – poštuj to
        this.router.navigateByUrl(target);

        // ako je login u popupu → zatvori modal
        this.closed.emit();
      },
      error: (err) => {
        this.stopLoading('Invalid credentials. Please try again.');
        console.error('Login error:', err);
      },
    });
  }

  onCreateAccountClick(): void {
    this.createAccount.emit();

    // na punoj /auth/login ruti i dalje koristi router za register
    if (this.openRegisterViaRouter && !this.compact) {
      this.router.navigate(['/auth/register']);
    }
  }

  handleCloseClick(): void {
    this.closed.emit();
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }
}
