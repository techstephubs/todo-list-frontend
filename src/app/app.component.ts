import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

interface LoginSuccessResponse {
  access_token?: string;
  token?: string;
  token_type?: string;
  expires_in?: number;
}

interface LoginErrorResponse {
  detail?: string;
  message?: string;
  error?: string;
}

interface StoredSession {
  token: string;
  tokenType: string;
  expiresIn: number | null;
  expiresAt: string | null;
  username: string;
  createdAt: string;
}

const SESSION_STORAGE_KEY = 'auth.session';

@Component({
  selector: 'tl-root',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  protected readonly loginForm = this.formBuilder.nonNullable.group({
    username: ['', [Validators.required, this.usernameOrEmailValidator()]],
    password: ['', [Validators.required]]
  });

  protected isLoading = false;
  protected showPassword = false;
  protected errorMessage = '';
  protected successMessage = '';
  protected activeSessionUsername = '';

  constructor(private readonly formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.restoreSession();
  }

  protected get usernameControl(): AbstractControl<string> {
    return this.loginForm.controls.username;
  }

  protected get passwordControl(): AbstractControl<string> {
    return this.loginForm.controls.password;
  }

  protected togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  protected onForgotPassword(event: Event): void {
    event.preventDefault();
    this.successMessage = 'Recuperação de senha indisponível no momento.';
    this.errorMessage = '';
  }

  protected async onSubmit(): Promise<void> {
    if (this.loginForm.invalid || this.isLoading) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const payload = {
      username: this.usernameControl.value.trim(),
      password: this.passwordControl.value
    };

    try {
      const response = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        await this.handleHttpError(response);
        return;
      }

      const data = (await response.json()) as LoginSuccessResponse;
      const token = data.access_token ?? data.token;

      if (!token) {
        throw new Error('Token not found in login response');
      }

      this.persistSession(payload.username, token, data.token_type ?? 'bearer', data.expires_in ?? null);
      this.activeSessionUsername = payload.username;
      this.successMessage = 'Login realizado com sucesso.';
      this.passwordControl.setValue('');
      this.loginForm.markAsPristine();
    } catch {
      this.errorMessage = 'Sistema indisponível, tente mais tarde';
    } finally {
      this.isLoading = false;
    }
  }


  private async handleHttpError(response: Response): Promise<void> {
    const backendMessage = await this.readBackendErrorMessage(response);

    if (response.status === 401) {
      this.errorMessage = backendMessage || 'Usuário ou senha incorretos';
      return;
    }

    this.errorMessage = backendMessage || 'Sistema indisponível, tente mais tarde';
  }

  private async readBackendErrorMessage(response: Response): Promise<string | null> {
    try {
      const data = (await response.json()) as LoginErrorResponse;
      const candidate = data.detail ?? data.message ?? data.error;
      return typeof candidate === 'string' && candidate.trim() ? candidate.trim() : null;
    } catch {
      return null;
    }
  }

  private persistSession(username: string, token: string, tokenType: string, expiresIn: number | null): void {
    const createdAtDate = new Date();
    const expiresAt = typeof expiresIn === 'number' ? new Date(createdAtDate.getTime() + expiresIn * 1000).toISOString() : null;

    const session: StoredSession = {
      token,
      tokenType,
      expiresIn,
      expiresAt,
      username,
      createdAt: createdAtDate.toISOString()
    };

    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  }

  private restoreSession(): void {
    const session = this.getStoredSession();
    if (!session) {
      return;
    }

    this.activeSessionUsername = session.username;
    this.successMessage = `Sessão restaurada para ${session.username}.`;
  }

  private getStoredSession(): StoredSession | null {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) {
      return null;
    }

    try {
      const parsed = JSON.parse(raw) as Partial<StoredSession>;
      if (!parsed.token || !parsed.username) {
        localStorage.removeItem(SESSION_STORAGE_KEY);
        return null;
      }

      if (parsed.expiresAt && new Date(parsed.expiresAt).getTime() <= Date.now()) {
        localStorage.removeItem(SESSION_STORAGE_KEY);
        return null;
      }

      return {
        token: parsed.token,
        tokenType: parsed.tokenType ?? 'bearer',
        expiresIn: parsed.expiresIn ?? null,
        expiresAt: parsed.expiresAt ?? null,
        username: parsed.username,
        createdAt: parsed.createdAt ?? new Date().toISOString()
      };
    } catch {
      localStorage.removeItem(SESSION_STORAGE_KEY);
      return null;
    }
  }

  private usernameOrEmailValidator(): ValidatorFn {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return (control: AbstractControl<string>): ValidationErrors | null => {
      const value = control.value?.trim() ?? '';
      if (!value) {
        return null;
      }

      if (value.includes('@') && !emailPattern.test(value)) {
        return { invalidEmailFormat: true };
      }

      return null;
    };
  }
}
