import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { RoomsService } from '../../../services/rooms.service';
import { LibrariesService } from '../../../services/libraries.service';

@Component({
  selector: 'app-rooms',
  standalone: false,
  templateUrl: './rooms.html',
  styleUrl: './rooms.scss'
})
export class RoomsComponent implements OnInit {

  rooms: any[] = [];
  libraries: any[] = [];

  modalOpen = false;
  editingRoom: any = null;

  showToast = false;
  toastMessage = '';

  form = {
    code: '',
    capacity: 1,
    status: 'AVAILABLE',
    hasProjector: false,
    hasCold: false,
    hasComputers: false,
    hasFrame: false,
    libraryId: ''
  };

  constructor(
    private roomService: RoomsService,
    private libraryService: LibrariesService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone  // ← garante que tudo roda dentro da zona do Angular
  ) {}

  ngOnInit(): void {
    this.loadRooms();
    this.loadLibraries();
  }

  loadRooms() {
    this.roomService.findAll().subscribe({
      next: (res: any) => {
        this.ngZone.run(() => {
          this.rooms = res || [];
          this.cdr.detectChanges();
        });
      },
      error: (err) => console.error(err)
    });
  }

  loadLibraries() {
    this.libraryService.findLibraries().subscribe({
      next: (res: any) => {
        this.ngZone.run(() => {
          this.libraries = Array.isArray(res) ? res : (res.content || []);
          this.cdr.detectChanges();
        });
      },
      error: (err) => console.error(err)
    });
  }

  openCreateModal() {
    this.editingRoom = null;
    this.form = {
      code: '',
      capacity: 1,
      status: 'AVAILABLE',
      hasProjector: false,
      hasCold: false,
      hasComputers: false,
      hasFrame: false,
      libraryId: ''
    };
    this.modalOpen = true;
  }

  openEditModal(room: any) {
    this.editingRoom = room;
    this.form = {
      code: room.code,
      capacity: room.capacity,
      status: room.status,
      hasProjector: room.hasProjector,
      hasCold: room.hasCold,
      hasComputers: room.hasComputers,
      hasFrame: room.hasFrame,
      libraryId: room.library?.id || ''
    };
    this.modalOpen = true;
  }

  closeModal() {
    this.modalOpen = false;
    this.editingRoom = null;
  }

  saveRoom() {
    if (!this.form.code) {
      this.showToastMessage('Informe o código da sala');
      return;
    }

    if (!this.form.libraryId) {
      this.showToastMessage('Selecione uma biblioteca');
      return;
    }

    this.modalOpen = false;

    this.roomService.create(this.form).subscribe({
      next: () => {
        this.loadRooms();
        this.showToastMessage('Sala criada com sucesso!');
      },
      error: (err) => {
        console.error(err);
        this.modalOpen = true;
        this.showToastMessage('Erro ao criar sala');
      }
    });
  }

  updateRoom() {
    if (!this.editingRoom) return;

    this.modalOpen = false;

    this.roomService.update(this.editingRoom.id, this.form).subscribe({
      next: () => {
        this.editingRoom = null;
        this.loadRooms();
        this.showToastMessage('Sala atualizada com sucesso!');
      },
      error: (err) => {
        console.error(err);
        this.modalOpen = true;
        this.showToastMessage('Erro ao atualizar sala');
      }
    });
  }

  deleteRoom(room: any) {
    if (!confirm(`Deseja excluir a sala ${room.code}?`)) return;

    this.roomService.delete(room.id).subscribe({
      next: () => {
        this.loadRooms();
        this.showToastMessage('Sala removida com sucesso!');
      },
      error: (err) => {
        console.error(err);
        this.showToastMessage('Erro ao remover sala');
      }
    });
  }

  showToastMessage(message: string) {
    this.ngZone.run(() => {
      this.toastMessage = message;
      this.showToast = true;
      this.cdr.detectChanges();

      setTimeout(() => {
        this.ngZone.run(() => {
          this.showToast = false;
          this.cdr.detectChanges();
        });
      }, 3000);
    });
  }

}