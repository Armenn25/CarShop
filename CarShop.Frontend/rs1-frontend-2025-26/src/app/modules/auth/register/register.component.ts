// src/app/modules/auth/register/register.component.ts
import { Component, EventEmitter, Input, Output, OnInit, HostListener } from '@angular/core';
import {AbstractControl,AsyncValidatorFn,FormBuilder,FormGroup,ValidationErrors,Validators,} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthFacadeService } from '../../../core/services/auth/auth-facade.service';
import { RegisterCommand } from '../../../api-services/auth/auth-api.model';
import { debounceTime, distinctUntilChanged, switchMap, catchError, of, map } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CurrentUserService } from '../../../core/services/auth/current-user.service';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit {
  @Input() compact = false;
  @Input() openLoginViaRouter: boolean = true;
  @Output() closed = new EventEmitter<void>();
  @Output() signIn = new EventEmitter<void>();

  currentStep = 1;
  readonly totalSteps = 3;
  readonly steps = [1, 2, 3];

  readonly stepSubtitles = ['Personal Information', 'Contact Details', 'Security & Address'];

  submitted = false;
  isLoading = false;
  apiError: string | null = null;
  private returnUrl: string | null = null;

  form: FormGroup;

  // password strength
  passwordStrength = 0;
  passwordStrengthLabel = 'Enter password';

  // da znamo da je registracija završena
  private hasCompletedRegistration = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthFacadeService,
    private snackBar: MatSnackBar, // 👈 NOVO
    private currentUser: CurrentUserService
  ) {
    this.form = this.fb.group(
      {
        firstName: ['', [Validators.required, Validators.maxLength(50)]],
        lastName: ['', [Validators.required, Validators.maxLength(50)]],

        username: this.fb.control('', {
          validators: [Validators.required, Validators.minLength(3), Validators.maxLength(30)],
          // async validator – provjera na BE
          asyncValidators: [this.usernameAvailabilityValidator()],
          // NEMA updateOn: 'blur' → validacija ide na valueChanges, ali je debounced
        }),

        email: this.fb.control('', {
          validators: [Validators.required, Validators.email],
          asyncValidators: [this.emailAvailabilityValidator()],
        }),

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

  // --- kontrole ---
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

  // --- helperi / error poruke ---

  showError(control: AbstractControl | null): boolean {
    return !!(control && control.invalid && (control.dirty || control.touched || this.submitted));
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

  get emailErrorMessage(): string {
    if (!this.email) return '';

    if (this.email.hasError('required')) return 'Email is required';
    if (this.email.hasError('email')) return 'Enter a valid email address';
    if (this.email.hasError('emailTaken')) return 'This email is already in use';

    return '';
  }

  get usernameErrorMessage(): string {
    if (!this.username) return '';

    if (this.username.hasError('required')) return 'Username is required';
    if (this.username.hasError('minlength')) return 'Use at least 3 characters';
    if (this.username.hasError('maxlength')) return 'Use at most 30 characters';
    if (this.username.hasError('usernameTaken')) return 'This username is already taken';

    return '';
  }

  getStepCssClass(step: number): string {
    if (step < this.currentStep) return 'done';
    if (step === this.currentStep) return 'current';
    return 'upcoming';
  }

  get progressPercent(): number {
    if (this.totalSteps <= 1) return 100;
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

  // --- ASYNC validator za email ---

  private emailAvailabilityValidator(): AsyncValidatorFn {
    return (control: AbstractControl) => {
      const value = (control.value ?? '').toString().trim();

      // ako je prazan ili već failao basic email validator → ne zovemo BE
      if (!value || control.hasError('email')) {
        return of(null);
      }

      return of(value).pipe(
        debounceTime(400),
        distinctUntilChanged(),
        switchMap((email) =>
          this.auth.checkEmailAvailability(email).pipe(
            map((isAvailable) => (isAvailable ? null : { emailTaken: true })),
            catchError(() => of(null)) // ne ruši formu ako endpoint padne
          )
        )
      );
    };
  }

  // --- ASYNC validator za username ---

  private usernameAvailabilityValidator(): AsyncValidatorFn {
    return (control: AbstractControl) => {
      const value = (control.value ?? '').toString().trim();

      if (!value || value.length < 3) {
        return of(null);
      }

      return of(value).pipe(
        debounceTime(400),
        distinctUntilChanged(),
        switchMap((username) =>
          this.auth.checkUsernameAvailability(username).pipe(
            map((isAvailable) => (isAvailable ? null : { usernameTaken: true })),
            catchError(() => of(null))
          )
        )
      );
    };
  }

  // --- PASSWORD STRENGTH ---

  onPasswordInput(): void {
    const pwd = this.password?.value ?? '';
    const result = this.calculatePasswordStrength(pwd);
    this.passwordStrength = result.score;
    this.passwordStrengthLabel = result.label;
  }

  get passwordStrengthClass(): 'empty' | 'weak' | 'medium' | 'strong' {
    if (!this.password || !this.password.value) return 'empty';
    if (this.passwordStrength < 40) return 'weak';
    if (this.passwordStrength < 70) return 'medium';
    return 'strong';
  }

  private calculatePasswordStrength(password: string): { score: number; label: string } {
    if (!password) {
      return { score: 0, label: 'Enter password' };
    }

    let score = 0;

    if (password.length >= 6) score += 20;
    if (password.length >= 10) score += 10;

    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[^A-Za-z0-9]/.test(password);

    const types = [hasLower, hasUpper, hasNumber, hasSymbol].filter((x) => x).length;
    score += types * 15;

    if (password.length < 6) {
      score = Math.min(score, 25);
    }

    score = Math.max(0, Math.min(100, score));

    let label = 'Weak';
    if (score >= 70) label = 'Strong';
    else if (score >= 40) label = 'Medium';

    return { score, label };
  }

  // --- upozorenje pri napuštanju (refresh / zatvaranje taba) ---

  @HostListener('window:beforeunload', ['$event'])
  handleBeforeUnload(event: BeforeUnloadEvent) {
    if (this.form && this.form.dirty && !this.hasCompletedRegistration) {
      event.preventDefault();
      event.returnValue = '';
    }
  }

  private confirmAbandonIfDirty(): boolean {
    if (this.hasCompletedRegistration) {
      return true;
    }

    if (!this.form || !this.form.dirty) {
      return true;
    }

    return window.confirm(
      'You have unsaved data in the registration form. Are you sure you want to leave this page?'
    );
  }

  // --- Geteri za ENABLE/DISABLE dugmadi ---

  get canGoNextFromStep1(): boolean {
    return !!(
      (
        this.firstName?.valid &&
        this.lastName?.valid &&
        this.username?.valid && // uključuje i usernameTaken
        !this.username?.pending
      ) // dok se provjerava -> false
    );
  }

  get canGoNextFromStep2(): boolean {
    return !!(
      this.email?.valid && // uključuje i emailTaken
      this.phone?.valid &&
      !this.email?.pending
    );
  }

  // --- NAVIGACIJA ---

  goToNext(): void {
    this.markStepControlsAsTouched(this.currentStep);

    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
    }
  }

  goToPrevious(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  // --- SUBMIT ---

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
        this.hasCompletedRegistration = true;

        // 🔥 prikazi success popup
        this.snackBar.open('Account successfully created. You are now logged in.', 'OK', {
          duration: 4000,
          panelClass: ['snackbar-success'],
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });

        // zatvori popup (ako je u compact modu)
        this.closed.emit();

        // ako je ovo "prava" /auth/register stranica -> redirect na default route
        if (!this.compact && this.openLoginViaRouter) {
          const target = this.returnUrl ?? this.currentUser.getDefaultRoute();
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
    if (!this.confirmAbandonIfDirty()) {
      return;
    }

    this.signIn.emit();

    if (this.openLoginViaRouter) {
      const queryParams = this.returnUrl ? { returnUrl: this.returnUrl } : undefined;
      this.router.navigate(['/auth/login'], { queryParams });
    }
  }

  handleCloseClick(): void {
    if (!this.confirmAbandonIfDirty()) {
      return;
    }

    this.closed.emit();
  }
}
