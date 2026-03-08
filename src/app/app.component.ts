import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Subject, filter, takeUntil } from 'rxjs';

type AuthView = 'login' | 'signup';
type ToastType = 'success' | 'error' | 'info';

interface ToastMessage {
  id: number;
  type: ToastType;
  text: string;
}

@Component({
  selector: 'tl-root',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit, OnDestroy {
  protected currentView: AuthView = 'login';
  protected isLinkedInLoading = false;
  protected isEmailLoading = false;
  protected isSignupLoading = false;
  protected toastMessages: ToastMessage[] = [];

  protected readonly loginForm;
  protected readonly signupForm;

  private readonly destroy$ = new Subject<void>();
  private toastIdCounter = 0;

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
  ) {
    this.loginForm = this.fb.nonNullable.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      rememberMe: [false],
    });

    this.signupForm = this.fb.nonNullable.group({
      firstName: ['', [Validators.required, Validators.maxLength(80)]],
      lastName: ['', [Validators.required, Validators.maxLength(80)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  ngOnInit(): void {
    this.syncViewWithUrl(this.router.url);

    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntil(this.destroy$),
      )
      .subscribe((event) => this.syncViewWithUrl(event.urlAfterRedirects));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected async onLinkedInLogin(): Promise<void> {
    if (this.isLinkedInLoading || this.isEmailLoading || this.isSignupLoading) {
      return;
    }

    this.isLinkedInLoading = true;
    try {
      await this.mockLinkedInLogin();
      this.pushToast('success', 'LinkedIn login successful. Redirecting to Todo List...');
    } catch {
      this.pushToast('error', 'Unable to complete LinkedIn login. Please try again.');
    } finally {
      this.isLinkedInLoading = false;
    }
  }

  protected async onEmailLogin(): Promise<void> {
    if (this.isEmailLoading || this.isLinkedInLoading || this.isSignupLoading) {
      return;
    }

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.pushToast('error', 'Please fix the highlighted login fields.');
      return;
    }

    this.isEmailLoading = true;
    try {
      const payload = this.loginForm.getRawValue();
      await this.mockLogin(payload.email, payload.password, payload.rememberMe);
      this.pushToast('success', 'Email login successful. Redirecting to Todo List...');
    } catch {
      this.pushToast('error', 'Invalid credentials for the mocked login flow.');
    } finally {
      this.isEmailLoading = false;
    }
  }

  protected async onSignup(): Promise<void> {
    if (this.isSignupLoading || this.isLinkedInLoading || this.isEmailLoading) {
      return;
    }

    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      this.pushToast('error', 'Please fix the highlighted signup fields.');
      return;
    }

    this.isSignupLoading = true;
    try {
      const payload = this.signupForm.getRawValue();
      await this.mockSignup(payload.firstName, payload.lastName, payload.email, payload.password);
      this.pushToast('success', 'Account created successfully. You can now log in.');
      this.signupForm.reset({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
      });
      await this.router.navigateByUrl('/login');
    } catch {
      this.pushToast('error', 'This mocked email is already in use. Use a different one.');
    } finally {
      this.isSignupLoading = false;
    }
  }

  protected dismissToast(id: number): void {
    this.toastMessages = this.toastMessages.filter((toast) => toast.id !== id);
  }

  private syncViewWithUrl(url: string): void {
    this.currentView = url.includes('/signup') ? 'signup' : 'login';
  }

  private async mockLinkedInLogin(): Promise<void> {
    await this.delay(900);
  }

  private async mockLogin(email: string, password: string, _rememberMe: boolean): Promise<void> {
    await this.delay(900);

    const normalizedEmail = email.trim().toLowerCase();
    const shouldFail = normalizedEmail.includes('fail') || normalizedEmail.includes('blocked') || password.length < 8;
    if (shouldFail) {
      throw new Error('Mocked login failed');
    }
  }

  private async mockSignup(firstName: string, lastName: string, email: string, password: string): Promise<void> {
    await this.delay(1100);

    const normalizedEmail = email.trim().toLowerCase();
    const hasRequiredData = firstName.trim().length > 0 && lastName.trim().length > 0 && password.length >= 8;
    if (!hasRequiredData || normalizedEmail.endsWith('@taken.com') || normalizedEmail.includes('fail')) {
      throw new Error('Mocked signup failed');
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private pushToast(type: ToastType, text: string): void {
    const id = ++this.toastIdCounter;
    this.toastMessages = [...this.toastMessages, { id, type, text }];
    setTimeout(() => this.dismissToast(id), 3500);
  }
}
