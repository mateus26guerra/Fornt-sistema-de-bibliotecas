import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Auth, LoggedUser } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  menuOpen = false;
  currentUser: LoggedUser | null = null;

  constructor(
    private auth: Auth,
    private router: Router
  ) {
    this.currentUser = this.auth.getUser();
  }

menus = [
  { nome: 'Dashboard', rota: '/dashboard' },
  { nome: 'Usuários', rota: '/users' },
  { nome: 'Bibliotecas', rota: '/libraries' },
  { nome: 'Salas', rota: '/rooms' }
];

logout(): void {
  this.auth.logout();
  this.router.navigate(['/']);
}

}

