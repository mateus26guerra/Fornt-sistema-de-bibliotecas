import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { UsersService } from './users.service';

export interface LoggedUser {
  id: string;
  matricula: string;
  email: string;
  name: string;
  role: string;
  active: boolean;
  created_at?: string;
}

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private readonly storageKey = 'loggedUser';

  constructor(private usersService: UsersService) {}

  login(email: string) {
    return this.usersService.findAll().pipe(
      map((response: any) => {
        const users = Array.isArray(response) ? response : response.content ?? [];
        const user = users.find(
          (item: LoggedUser) => item.email.toLowerCase() === email.trim().toLowerCase()
        );

        if (!user) {
          throw new Error('Usuario nao encontrado');
        }

        if (!user.active) {
          throw new Error('Usuario inativo');
        }

        this.saveUser(user);

        return user;
      })
    );
  }

  saveUser(user: LoggedUser): void {
    if (!this.canUseStorage()) {
      return;
    }

    localStorage.setItem(this.storageKey, JSON.stringify(user));
    localStorage.setItem('userId', user.id);
  }

  getUser(): LoggedUser | null {
    if (!this.canUseStorage()) {
      return null;
    }

    const savedUser = localStorage.getItem(this.storageKey);

    return savedUser ? JSON.parse(savedUser) : null;
  }

  logout(): void {
    if (!this.canUseStorage()) {
      return;
    }

    localStorage.removeItem(this.storageKey);
    localStorage.removeItem('userId');
  }

  getUserId(): string | null {
    if (!this.canUseStorage()) {
      return null;
    }

    return localStorage.getItem('userId');
  }

  private canUseStorage(): boolean {
    return typeof localStorage !== 'undefined';
  }
}
