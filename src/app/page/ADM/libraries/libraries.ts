import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { LibrariesService } from '../../../services/libraries.service';

@Component({
  selector: 'app-libraries',
  standalone: false,
  templateUrl: './libraries.html',
  styleUrl: './libraries.scss',
})
export class Libraries implements OnInit {

  libraries: any[] = [];

  modalOpen = false;

  editingLibrary: any = null;

  loading = false;

  showToast = false;

  toastMessage = '';

  toastType = 'success';

  form = {
    name: '',
    description: '',
    email: '',
    phone: '',
    ownerId: '',
    status: 'ACTIVE'
  };

  errors = {
    name: '',
    email: '',
    phone: '',
    ownerId: ''
  };

  constructor(
    private librariesService: LibrariesService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getLibraries();

  }

  getLibraries() {

    this.loading = true;

    this.librariesService.findAll().subscribe({

      next: (response: any) => {

        this.libraries = response.content;

        this.loading = false;
                this.cdr.detectChanges(); // ← força atualizar a tela

      },

      error: () => {
        this.loading = false;
      }

    });

  }

  openCreateModal() {

    this.editingLibrary = null;

    this.clearErrors();

    this.form = {
      name: '',
      description: '',
      email: '',
      phone: '',
      ownerId: '',
      status: 'ACTIVE'
    };

    this.modalOpen = true;
  }

  openEditModal(library: any) {

    this.editingLibrary = library;

    this.clearErrors();

    this.form = {
      name: library.name,
      description: library.description,
      email: library.email,
      phone: library.phone,
      ownerId: '',
      status: library.status
    };

    this.modalOpen = true;
  }

  validateForm(): boolean {

    this.clearErrors();

    let valid = true;

    if (!this.form.name.trim()) {
      this.errors.name = 'Nome obrigatório';
      valid = false;
    }

    if (!this.form.email.includes('@')) {
      this.errors.email = 'Email inválido';
      valid = false;
    }

    if (!this.form.phone.trim()) {
      this.errors.phone = 'Telefone obrigatório';
      valid = false;
    }

    if (
      !this.editingLibrary &&
      !this.form.ownerId.trim()
    ) {
      this.errors.ownerId = 'OwnerId obrigatório';
      valid = false;
    }

    return valid;

  }

  clearErrors() {

    this.errors = {
      name: '',
      email: '',
      phone: '',
      ownerId: ''
    };

  }

  saveLibrary() {

    if (!this.validateForm()) return;

    this.loading = true;

    // EDITAR

    if (this.editingLibrary) {

      const payload = {
        name: this.form.name,
        description: this.form.description,
        email: this.form.email,
        phone: this.form.phone,
        status: this.form.status
      };

      this.librariesService.update(
        this.editingLibrary.id,
        payload
      ).subscribe({

        next: (updated: any) => {

          const index = this.libraries.findIndex(
            l => l.id === this.editingLibrary.id
          );

          if (index !== -1) {
            this.libraries[index] = updated;
          }

          this.closeModal();

          this.loading = false;

          this.showToastMessage(
            'Biblioteca atualizada com sucesso!',
            'success'
          );

        },

        error: () => {

          this.loading = false;

          this.showToastMessage(
            'Erro ao atualizar biblioteca!',
            'error'
          );

        }

      });

    }

    // CRIAR

    else {

      const payload = {
        name: this.form.name,
        description: this.form.description,
        email: this.form.email,
        phone: this.form.phone,
        ownerId: this.form.ownerId
      };

      this.librariesService.create(payload)
      .subscribe({

        next: (newLibrary: any) => {

          this.libraries.unshift(newLibrary);

          this.closeModal();

          this.loading = false;

          this.showToastMessage(
            'Biblioteca criada com sucesso!',
            'success'
          );

        },

        error: () => {

          this.loading = false;

          this.showToastMessage(
            'Erro ao criar biblioteca!',
            'error'
          );

        }

      });

    }

  }

  deleteLibrary(library: any) {

    const confirmDelete = confirm(
      `Deseja remover ${library.name}?`
    );

    if (!confirmDelete) return;

    this.librariesService.delete(library.id)
    .subscribe({

      next: () => {

        this.libraries =
          this.libraries.filter(
            l => l.id !== library.id
          );

        this.showToastMessage(
          'Biblioteca removida!',
          'success'
        );

      },

      error: () => {

        this.showToastMessage(
          'Erro ao remover biblioteca!',
          'error'
        );

      }

    });

  }

  closeModal() {

    this.modalOpen = false;

    this.editingLibrary = null;

  }

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

}