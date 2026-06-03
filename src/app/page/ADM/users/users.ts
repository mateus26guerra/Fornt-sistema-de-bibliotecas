import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import { UsersService }
from '../../../services/users.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.html',
  styleUrls: ['./users.scss'],
  standalone: false
})

export class UsersComponent
implements OnInit {

  users: any[] = [];

  loading = false;

  modalOpen = false;

  editingUser: any = null;

  showToast = false;

  toastMessage = '';

  toastType = 'success';

  form = {

    name: '',

    email: '',

    matricula: '',

    password: '',

    role: 'ALUNO'

  };

  errors = {

    name: '',

    email: '',

    matricula: '',

    password: ''

  };

  constructor(
    private usersService: UsersService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    this.getUsers();

  }

  // =========================
  // GET USERS
  // =========================

  getUsers() {

    this.loading = true;

    this.usersService.findAll()
    .subscribe({

      next: (response: any) => {

        this.users = Array.isArray(response)
          ? response
          : response.content ?? [];

        this.loading = false;
        this.cdr.detectChanges(); // ← força atualizar a tela

      },

      error: (error) => {

        console.log(error);

        this.loading = false;

      }

    });

  }

  // =========================
  // MODAL CREATE
  // =========================

  openCreateModal() {

    this.editingUser = null;

    this.clearErrors();

    this.form = {

      name: '',

      email: '',

      matricula: '',

      password: '',

      role: 'ALUNO'

    };

    this.modalOpen = true;

  }

  // =========================
  // MODAL EDIT
  // =========================

  openEditModal(user: any) {

    this.editingUser = user;

    this.clearErrors();

    this.form = {

      name: user.name,

      email: user.email,

      matricula: user.matricula,

      password: '',

      role: user.role

    };

    this.modalOpen = true;

  }

  // =========================
  // VALIDATE
  // =========================

  validateForm(): boolean {

    this.clearErrors();

    let valid = true;

    if (!this.form.name.trim()) {

      this.errors.name =
        'Nome obrigatório';

      valid = false;

    }

    if (!this.form.email.trim()) {

      this.errors.email =
        'Email obrigatório';

      valid = false;

    }

    if (
      !this.form.email.includes('@')
    ) {

      this.errors.email =
        'Email inválido';

      valid = false;

    }

    if (
      !this.editingUser &&
      this.form.matricula.length !== 8
    ) {

      this.errors.matricula =
        'Matrícula deve ter 8 caracteres';

      valid = false;

    }

    if (
      !this.editingUser &&
      this.form.password.length < 6
    ) {

      this.errors.password =
        'Senha mínima de 6 caracteres';

      valid = false;

    }

    return valid;

  }

  // =========================
  // CLEAR ERRORS
  // =========================

  clearErrors() {

    this.errors = {

      name: '',

      email: '',

      matricula: '',

      password: ''

    };

  }

  // =========================
  // SAVE USER
  // =========================

  saveUser() {

    if (!this.validateForm()) return;

    this.loading = true;

    // =====================
    // EDITAR
    // =====================

    if (this.editingUser) {

      const payload = {

        name: this.form.name,

        email: this.form.email

      };

      this.usersService.update(
        this.editingUser.id,
        payload
      ).subscribe({

        next: (updatedUser: any) => {

          const index =
            this.users.findIndex(
              u =>
              u.id === this.editingUser.id
            );

          if (index !== -1) {

            this.users[index] = {

              ...this.users[index],

              ...updatedUser

            };

          }

          this.closeModal();

          this.loading = false;

          this.showToastMessage(
            'Usuário atualizado!',
            'success'
          );

        },

        error: () => {

          this.loading = false;

          this.showToastMessage(
            'Erro ao atualizar!',
            'error'
          );

        }

      });

    }

    // =====================
    // CRIAR
    // =====================

    else {

      const payload = {

        matricula:
          this.form.matricula,

        email:
          this.form.email,

        password:
          this.form.password,

        role:
          this.form.role,

        name:
          this.form.name

      };

      this.usersService.create(payload)
      .subscribe({

        next: (newUser: any) => {

          this.users.unshift(newUser);

          this.closeModal();

          this.loading = false;

          this.showToastMessage(
            'Usuário criado!',
            'success'
          );

        },

        error: () => {

          this.loading = false;

          this.showToastMessage(
            'Erro ao criar!',
            'error'
          );

        }

      });

    }

  }

  // =========================
  // DELETE
  // =========================

  deleteUser(user: any) {

    const confirmDelete =
      confirm(
        `Deseja remover ${user.name}?`
      );

    if (!confirmDelete) return;

    this.usersService.delete(user.id)
    .subscribe({

      next: () => {

        this.users =
          this.users.filter(
            u => u.id !== user.id
          );

        this.showToastMessage(
          'Usuário removido!',
          'success'
        );

      },

      error: () => {

        this.showToastMessage(
          'Erro ao remover!',
          'error'
        );

      }

    });

  }

  // =========================
  // TOAST
  // =========================

  showToastMessage(
    message: string,
    type: string
  ) {

    this.toastMessage = message;

    this.toastType = type;

    this.showToast = true;

    setTimeout(() => {

      this.showToast = false;

    }, 3000);

  }

  // =========================
  // CLOSE MODAL
  // =========================

  closeModal() {

    this.modalOpen = false;

    this.editingUser = null;

    this.form = {

      name: '',

      email: '',

      matricula: '',

      password: '',

      role: 'ALUNO'

    };

  }

}
