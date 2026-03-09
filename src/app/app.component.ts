import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators, FormBuilder } from '@angular/forms';

interface LoginSuccessResponse {
  access_token?: string;
  token?: string;
  token_type?: string;
  expires_in?: number;
}

@Component({
  selector: 'tl-root',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  protected readonly loginForm = this.formBuilder.nonNullable.group({
    username: ['', [Validators.required, this.usernameOrEmailValidator()]],
    password: ['', [Validators.required]]
  });

  protected isLoading = false;
  protected showPassword = false;
  protected errorMessage = '';
  protected successMessage = '';

  constructor(private readonly formBuilder: FormBuilder) {}

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
        this.handleHttpError(response.status);
        return;
      }

      const data = (await response.json()) as LoginSuccessResponse;
      const token = data.access_token ?? data.token;

      if (!token) {
        throw new Error('Token not found in login response');
      }

      localStorage.setItem(
        'auth.session',
        JSON.stringify({
          token,
          tokenType: data.token_type ?? 'bearer',
          expiresIn: data.expires_in ?? null,
          username: payload.username,
          createdAt: new Date().toISOString()
        })
      );

      this.successMessage = 'Login realizado com sucesso.';
      this.loginForm.markAsPristine();
    } catch {
      this.errorMessage = 'Sistema indisponível, tente mais tarde';
    } finally {
      this.isLoading = false;
    }
  }

  private handleHttpError(statusCode: number): void {
    if (statusCode === 401) {
      this.errorMessage = 'Usuário ou senha incorretos';
      return;
    }

    this.errorMessage = 'Sistema indisponível, tente mais tarde';
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
