import { Component, DestroyRef, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

const FULL_PAGE_ROUTES = ['/login', '/signup', '/register', '/pricing'];

@Component({
  selector: 'tl-root',
  imports: [RouterOutlet],
  template: `
    <div class="app-shell" [class.full-page]="isFullPage()">
      <router-outlet />
    </div>
  `,
  styleUrl: './app.component.css'
})
export class AppComponent {
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly isFullPage = signal(true);

  constructor() {
    this.updateFullPage(this.router.url);

    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((event) => this.updateFullPage(event.urlAfterRedirects));
  }

  private updateFullPage(url: string): void {
    this.isFullPage.set(FULL_PAGE_ROUTES.some((route) => url.startsWith(route)));
  }
}
