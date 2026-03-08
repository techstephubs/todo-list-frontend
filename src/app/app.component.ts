import { Component, inject } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';

import { ToastService } from './core/services/toast.service';

@Component({
  selector: 'tl-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);

  protected readonly toasts = this.toastService.toasts;
  protected isAuthRoute = this.isAuthenticationUrl(this.router.url);

  constructor() {
    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd,
        ),
      )
      .subscribe((event) => {
        this.isAuthRoute = this.isAuthenticationUrl(event.urlAfterRedirects);
      });
  }

  protected dismissToast(toastId: number): void {
    this.toastService.dismiss(toastId);
  }

  private isAuthenticationUrl(url: string): boolean {
    return (
      url.startsWith('/login') ||
      url.startsWith('/signup') ||
      url.startsWith('/register') ||
      url.startsWith('/cadastro')
    );
  }
}
