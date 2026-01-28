import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <div class="app">
      @if (authService.isAuthenticated()) {
        <nav class="navbar">
          <div class="navbar-brand">
            <a routerLink="/tasks">Blue Company</a>
          </div>
          <div class="navbar-menu">
            <a routerLink="/tasks" class="nav-link">Tareas</a>
            <a routerLink="/projects" class="nav-link">Proyectos</a>
            <span class="user-name">{{ authService.currentUser()?.nombre }}</span>
            <button class="btn btn-secondary" (click)="logout()">Salir</button>
          </div>
        </nav>
      }
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .app {
      min-height: 100vh;
    }

    .navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px 30px;
      background: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .navbar-brand a {
      font-size: 20px;
      font-weight: bold;
      color: #007bff;
      text-decoration: none;
    }

    .navbar-menu {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .nav-link {
      color: #333;
      text-decoration: none;
      &:hover { color: #007bff; }
    }

    .user-name {
      color: #666;
      font-size: 14px;
    }

    .main-content {
      padding: 20px;
    }
  `]
})
export class AppComponent {
  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  logout(): void {
    this.authService.logout();
  }
}
