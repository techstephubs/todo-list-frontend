import { Component } from '@angular/core';
import { Routes, RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'tl-home-page',
  imports: [RouterLink],
  template: `
    <section>
      <h2>Home</h2>
      <p>Welcome to TODO-LIST. Organize your daily tasks with a simple flow.</p>
      <p>
        <a routerLink="/login">Go to login</a>
      </p>
    </section>
  `
})
export class HomePageComponent {}

@Component({
  standalone: true,
  selector: 'tl-login-page',
  imports: [RouterLink],
  template: `
    <section>
      <h2>Login</h2>
      <form>
        <label for="email">Email</label>
        <input id="email" type="email" name="email" autocomplete="email" required />

        <label for="password">Password</label>
        <input id="password" type="password" name="password" autocomplete="current-password" required />

        <button type="button" routerLink="/todos">Sign in</button>
      </form>
    </section>
  `,
  styles: [
    `
      form {
        display: grid;
        gap: 0.5rem;
        max-width: 320px;
      }

      input,
      button {
        padding: 0.55rem;
      }
    `
  ]
})
export class LoginPageComponent {}

@Component({
  standalone: true,
  selector: 'tl-todo-list-page',
  template: `
    <section>
      <h2>TODO List</h2>
      <ul>
        <li>
          <label><input type="checkbox" /> Create Angular scaffold</label>
        </li>
        <li>
          <label><input type="checkbox" /> Implement routes</label>
        </li>
        <li>
          <label><input type="checkbox" /> Review and ship</label>
        </li>
      </ul>
    </section>
  `,
  styles: [
    `
      ul {
        padding-left: 1rem;
      }

      li {
        margin-bottom: 0.4rem;
      }
    `
  ]
})
export class TodoListPageComponent {}

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home'
  },
  {
    path: 'home',
    component: HomePageComponent
  },
  {
    path: 'login',
    component: LoginPageComponent
  },
  {
    path: 'todos',
    component: TodoListPageComponent
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];
