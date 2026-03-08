import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'tl-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="app-shell">
      <header class="app-header">
        <h1 class="app-title">TODO-LIST</h1>
        <nav class="app-nav" aria-label="Main navigation">
          <a routerLink="/home" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Home</a>
          <a routerLink="/login" routerLinkActive="active">Login</a>
          <a routerLink="/todos" routerLinkActive="active">List</a>
        </nav>
      </header>

      <main class="app-content">
        <router-outlet />
      </main>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        min-height: 100vh;
        background: #f3f4f6;
        color: #111827;
        font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      }

      .app-shell {
        max-width: 960px;
        margin: 0 auto;
        padding: 1rem;
      }

      .app-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        background: #ffffff;
        border-radius: 0.75rem;
        border: 1px solid #e5e7eb;
      }

      .app-title {
        margin: 0;
        font-size: 1.25rem;
      }

      .app-nav {
        display: flex;
        gap: 0.75rem;
      }

      .app-nav a {
        text-decoration: none;
        color: #374151;
        padding: 0.4rem 0.7rem;
        border-radius: 0.5rem;
      }

      .app-nav a.active,
      .app-nav a:hover {
        background: #111827;
        color: #ffffff;
      }

      .app-content {
        margin-top: 1rem;
        padding: 1rem;
        background: #ffffff;
        border-radius: 0.75rem;
        border: 1px solid #e5e7eb;
      }
    `
  ]
})
export class AppComponent {
  title = 'todo-list-frontend';
}
