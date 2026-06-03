import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../../../services/auth.service';

@Component({
  selector: 'app-tela-de-login',
  standalone: false,
  templateUrl: './tela-de-login.html',
  styleUrl: './tela-de-login.scss',
})
export class TelaDeLogin {
  email = '';
  password = '';
  loading = false;
  errorMessage = '';

  constructor(
    private auth: Auth,
    private router: Router
  ) {}

  login(): void {
    this.errorMessage = '';

    if (!this.email.trim()) {
      this.errorMessage = 'Informe seu e-mail.';
      return;
    }

    this.loading = true;

    this.auth.login(this.email).subscribe({
      next: (user) => {
        this.loading = false;

        if (user.role === 'ALUNO') {
          this.router.navigate(['/roomaluno']);
          return;
        }

        this.router.navigate(['/painel']);
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.message || 'Erro ao fazer login.';
      }
    });
  }

}
