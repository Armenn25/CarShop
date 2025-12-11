// src/app/modules/auth/register/register.component.ts
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthFacadeService } from '../../../core/services/auth/auth-facade.service';
import { RegisterCommand } from '../../../api-services/auth/auth-api.model';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit {
  /** Ako otvaraš kao popup iz public layouta, stavi [compact]="true" */
  @Input() compact = false;

  /** Parent (npr. PublicLayout) može slušati (closed) da zatvori popup */
  @Input() openLoginViaRouter: boolean = true;
  @Output() closed = new EventEmitter<void>();
  @Output() signIn = new EventEmitter<void>();

  currentStep = 1;
  readonly totalSteps = 3;
  readonly steps = [1, 2, 3];

  /** podnaslovi po koracima, kao na slikama */
  readonly stepSubtitles = ['Personal Information', 'Contact Details', 'Security & Address'];

  submitted = false;
  isLoading = false;
  apiError: string | null = null;

  private returnUrl: string | null = null;

  form: FormGroup;

  // =========================================
  // NEW: PASSWORD STRENGTH STATE
  // =========================================
  /** Jačina lozinke u % (0–100) */
  passwordStrength = 0; // NEW
  /** Labela koja se prikazuje u znački (Weak / Medium / Strong / Enter password) */
  passwordStrengthLabel = 'Enter password'; // NEW
  // =========================================

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthFacadeService
  ) {
    this.form = this.fb.group(
      {
        firstName: ['', [Validators.required, Validators.maxLength(50)]],
        lastName: ['', [Validators.required, Validators.maxLength(50)]],
        username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],

        email: ['', [Validators.required, Validators.email]],
        phone: ['', [Validators.required, Validators.pattern(/^\+?[0-9\s\-()]{7,20}$/)]],

        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
        address: ['', [Validators.required, Validators.minLength(5)]],
      },
      { validators: this.passwordsMatchValidator }
    );
  }

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
  }

  // --- kontroleri za template ---
  get firstName() {
    return this.form.get('firstName');
  }
  get lastName() {
    return this.form.get('lastName');
  }
  get username() {
    return this.form.get('username');
  }
  get email() {
    return this.form.get('email');
  }
  get phone() {
    return this.form.get('phone');
  }
  get password() {
    return this.form.get('password');
  }
  get confirmPassword() {
    return this.form.get('confirmPassword');
  }
  get address() {
    return this.form.get('address');
  }

  // --- helperi ---

  showError(control: AbstractControl | null): boolean {
    return !!(control && control.invalid && (control.touched || this.submitted));
  }

  get passwordErrorMessage(): string {
    if (!this.password) return '';

    if (this.password.hasError('required')) {
      return 'Password is required';
    }
    if (this.password.hasError('minlength')) {
      return 'Use at least 6 characters';
    }
    if (this.form.hasError('passwordsMismatch')) {
      return 'Passwords do not match';
    }
    return '';
  }

  getStepCssClass(step: number): string {
    if (step < this.currentStep) return 'done';
    if (step === this.currentStep) return 'current';
    return 'upcoming';
  }

  get progressPercent(): number {
    if (this.totalSteps <= 1) return 100;
    // 1/3 → ~0%, 2/3 → ~50%, 3/3 → 100%
    return ((this.currentStep - 1) / (this.totalSteps - 1)) * 100;
  }

  private passwordsMatchValidator = (group: AbstractControl): ValidationErrors | null => {
    const pwd = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;

    if (!pwd || !confirm) {
      return null;
    }
    return pwd !== confirm ? { passwordsMismatch: true } : null;
  };

  isStepValid(step: number): boolean {
    switch (step) {
      case 1:
        return !!(this.firstName?.valid && this.lastName?.valid && this.username?.valid);
      case 2:
        return !!(this.email?.valid && this.phone?.valid);
      case 3:
        return !!(
          this.password?.valid &&
          this.confirmPassword?.valid &&
          this.address?.valid &&
          !this.form.hasError('passwordsMismatch')
        );
      default:
        return false;
    }
  }

  private markStepControlsAsTouched(step: number): void {
    const controls: AbstractControl[] = [];

    if (step === 1) {
      if (this.firstName) controls.push(this.firstName);
      if (this.lastName) controls.push(this.lastName);
      if (this.username) controls.push(this.username);
    } else if (step === 2) {
      if (this.email) controls.push(this.email);
      if (this.phone) controls.push(this.phone);
    } else if (step === 3) {
      if (this.password) controls.push(this.password);
      if (this.confirmPassword) controls.push(this.confirmPassword);
      if (this.address) controls.push(this.address);
    }

    controls.forEach((c) => {
      c.markAsTouched();
      c.updateValueAndValidity();
    });
  }

  // =========================================
  // NEW: PASSWORD STRENGTH LOGIKA
  // =========================================

  /** Poziva se na (input) event od password polja */
  onPasswordInput(): void {
    // NEW
    const pwd = this.password?.value ?? '';
    const result = this.calculatePasswordStrength(pwd);
    this.passwordStrength = result.score;
    this.passwordStrengthLabel = result.label;
  }

  /** CSS klasa za badge/bar: weak / medium / strong / empty */
  get passwordStrengthClass(): 'empty' | 'weak' | 'medium' | 'strong' {
    // NEW
    if (!this.password || !this.password.value) return 'empty';
    if (this.passwordStrength < 40) return 'weak';
    if (this.passwordStrength < 70) return 'medium';
    return 'strong';
  }

  /** Izračun jačine lozinke (score 0–100 + labela) */
  private calculatePasswordStrength(password: string): { score: number; label: string } {
    // NEW
    if (!password) {
      return { score: 0, label: 'Enter password' };
    }

    let score = 0;

    // dužina
    if (password.length >= 6) score += 10;
    if (password.length >= 10) score += 20;

    // tipovi znakova
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[^A-Za-z0-9]/.test(password);

    const types = [hasLower, hasUpper, hasNumber, hasSymbol].filter((x) => x).length;
    score += types * 15; // max +60

    // malo kazni ultra kratke lozinke
    if (password.length < 6) {
      score = Math.min(score, 25);
    }

    // clamp 0–100
    score = Math.max(0, Math.min(100, score));

    let label = 'Weak';
    if (score >= 70) label = 'Strong';
    else if (score >= 40) label = 'Medium';

    return { score, label };
  }

  // =========================================

  // --- navigacija ---

  goToNext(): void {
    this.markStepControlsAsTouched(this.currentStep);

    if (!this.isStepValid(this.currentStep)) {
      return;
    }

    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
    }
  }

  goToPrevious(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  // submit na zadnjem koraku
  onSubmit(): void {
    this.submitted = true;
    this.form.markAllAsTouched();
    this.apiError = null;

    if (this.form.invalid) {
      this.markStepControlsAsTouched(this.currentStep);
      return;
    }

    const v = this.form.value;

    const payload: RegisterCommand = {
      username: (v.username ?? '').trim(),
      email: (v.email ?? '').trim().toLowerCase(),
      password: v.password ?? '',
      firstName: (v.firstName ?? '').trim(),
      lastName: (v.lastName ?? '').trim(),
      phone: v.phone?.toString().trim() || null,
      address: (v.address ?? '').trim(),
      fingerprint: null,
    };

    this.isLoading = true;

    this.auth.register(payload).subscribe({
      next: () => {
        this.isLoading = false;

        // zatvoriti popup (ako postoji listener)
        this.closed.emit();

        // ako smo na "pravoj" /auth/register ruti → redirect
        if (!this.compact && this.openLoginViaRouter) {
          const target = this.returnUrl ?? '/';
          this.router.navigateByUrl(target);
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.apiError = err?.error?.message ?? 'Registration failed. Please try again.';
        console.error('Register error:', err);
      },
    });
  }

  onSignInClick(): void {
    this.signIn.emit();

    if (this.openLoginViaRouter) {
      const queryParams = this.returnUrl ? { returnUrl: this.returnUrl } : undefined;
      this.router.navigate(['/auth/login'], { queryParams });
    }
  }

  handleCloseClick(): void {
    this.closed.emit();
  }
}
