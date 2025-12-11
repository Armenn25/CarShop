// src/app/modules/auth/register/register.component.ts
import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
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
  readonly stepSubtitles = [
    'Personal Information',
    'Contact Details',
    'Security & Address'
  ];

  submitted = false;

  form: FormGroup;

  constructor(private fb: FormBuilder,private router: Router) {
    this.form = this.fb.group(
      {
        firstName: ['', [Validators.required, Validators.maxLength(50)]],
        lastName: ['', [Validators.required, Validators.maxLength(50)]],
        username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],

        email: ['', [Validators.required, Validators.email]],
        phone: [
          '',
          [
            Validators.required,
            Validators.pattern(/^\+?[0-9\s\-()]{7,20}$/)
          ]
        ],

        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
        address: ['', [Validators.required, Validators.minLength(5)]]
      },
      { validators: this.passwordsMatchValidator }
    );
  }

  // --- kontroleri za template ---
  get firstName() { return this.form.get('firstName'); }
  get lastName() { return this.form.get('lastName'); }
  get username() { return this.form.get('username'); }
  get email() { return this.form.get('email'); }
  get phone() { return this.form.get('phone'); }
  get password() { return this.form.get('password'); }
  get confirmPassword() { return this.form.get('confirmPassword'); }
  get address() { return this.form.get('address'); }

  // --- helperi ---

  showError(control: AbstractControl | null): boolean {
    return !!(
      control &&
      control.invalid &&
      (control.touched || this.submitted)
    );
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
        return !!(
          this.firstName?.valid &&
          this.lastName?.valid &&
          this.username?.valid
        );
      case 2:
        return !!(
          this.email?.valid &&
          this.phone?.valid
        );
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

    controls.forEach(c => {
      c.markAsTouched();
      c.updateValueAndValidity();
    });
  }

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

    if (this.form.invalid) {
      this.markStepControlsAsTouched(this.currentStep);
      return;
    }

    const payload = this.form.value;
    // TODO: pozovi register API
    console.log('Register payload', payload);

    // nakon uspješne registracije možeš:
    // - zatvoriti popup
    // - ili redirect na login/dashboard
    this.closed.emit();
  }

    onSignInClick(): void {
    this.signIn.emit();

    // ako se koristi kao klasična ruta (/auth/register)
    if (this.openLoginViaRouter) {
      this.router.navigate(['/auth/login']);
    }
  }

  handleCloseClick(): void {
    this.closed.emit();
  }
}
