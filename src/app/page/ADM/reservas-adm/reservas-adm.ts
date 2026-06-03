import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { LibrariesService } from '../../../services/libraries.service';
import { ReservationsService } from '../../../services/reservations.service';
import { RoomsService } from '../../../services/rooms.service';
import { UsersService } from '../../../services/users.service';

@Component({
  selector: 'app-reservas-adm',
  templateUrl: './reservas-adm.html',
  styleUrls: ['./reservas-adm.scss'],
  standalone: false
})
export class ReservasAdm implements OnInit {

  libraries: any[] = [];
  rooms: any[] = [];
  filteredRooms: any[] = [];
  students: any[] = [];
  reservations: any[] = [];

  selectedLibrary: any = null;
  selectedRoom: any = null;
  selectedStudent: any = null;

  currentStep = 1;

  loadingLibraries = false;
  loadingRooms = false;
  loadingStudents = false;
  submitting = false;

  showToast = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';

  today = new Date().toISOString().split('T')[0];
  selectedDate = new Date().toISOString().split('T')[0];

  startTime = '08:00';
  endTime = '09:00';

  constructor(
    private librariesService: LibrariesService,
    private roomsService: RoomsService,
    private reservationsService: ReservationsService,
    private usersService: UsersService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadLibraries();
    this.loadRooms();
    this.loadStudents();
    this.loadReservations();
    this.calcEndTime();
  }

  get availableRooms(): number {
    return this.rooms.filter(room => room.status === 'AVAILABLE').length;
  }

  loadLibraries(): void {
    this.loadingLibraries = true;

    this.librariesService.findAll().subscribe({
      next: (res: any) => {
        this.libraries = Array.isArray(res) ? res : res.content ?? [];
        this.loadingLibraries = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loadingLibraries = false;
        this.show('Erro ao carregar bibliotecas', 'error');
      }
    });
  }

  loadRooms(): void {
    this.loadingRooms = true;

    this.roomsService.findAll().subscribe({
      next: (res: any) => {
        this.rooms = Array.isArray(res) ? res : res.content ?? [];
        this.loadingRooms = false;

        if (this.selectedLibrary) {
          this.filterRoomsByLibrary();
        }

        this.cdr.detectChanges();
      },
      error: () => {
        this.loadingRooms = false;
        this.show('Erro ao carregar salas', 'error');
      }
    });
  }

  loadStudents(): void {
    this.loadingStudents = true;

    this.usersService.findAll().subscribe({
      next: (res: any) => {
        const users = this.extractList(res);
        this.students = users.filter((user: any) =>
          String(user.role ?? '').toUpperCase() === 'ALUNO'
        );
        this.loadingStudents = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loadingStudents = false;
        this.show('Erro ao carregar alunos', 'error');
      }
    });
  }

  private extractList(response: any): any[] {
    if (Array.isArray(response)) {
      return response;
    }

    if (Array.isArray(response?.content)) {
      return response.content;
    }

    if (Array.isArray(response?.data)) {
      return response.data;
    }

    if (Array.isArray(response?.items)) {
      return response.items;
    }

    return [];
  }

  loadReservations(): void {
    this.reservationsService.findAll().subscribe({
      next: (res: any) => {
        this.reservations = Array.isArray(res) ? res : res.content ?? [];
        this.cdr.detectChanges();
      },
      error: () => {
        this.reservations = [];
      }
    });
  }

  selectLibrary(library: any): void {
    this.selectedLibrary = library;
    this.selectedRoom = null;
    this.filterRoomsByLibrary();
  }

  filterRoomsByLibrary(): void {
    this.filteredRooms = this.rooms.filter(room =>
      room.library?.id === this.selectedLibrary?.id ||
      room.libraryId === this.selectedLibrary?.id
    );
  }

  selectRoom(room: any): void {
    if (room.status !== 'AVAILABLE') {
      return;
    }

    this.selectedRoom = room;
  }

  selectStudent(student: any): void {
    this.selectedStudent = student;
  }

  goToStep(step: number): void {
    if (step === 2 && !this.selectedLibrary) {
      this.show('Selecione uma biblioteca', 'error');
      return;
    }

    if (step === 3 && !this.selectedRoom) {
      this.show('Selecione uma sala', 'error');
      return;
    }

    if (step === 4 && !this.selectedStudent) {
      this.show('Selecione um aluno', 'error');
      return;
    }

    this.currentStep = step;
  }

  calcEndTime(): void {
    if (!this.startTime) {
      return;
    }

    const [hour, minute] = this.startTime.split(':').map(Number);

    const date = new Date();
    date.setHours(hour, minute, 0, 0);
    date.setHours(date.getHours() + 1);

    this.endTime = date.toTimeString().slice(0, 5);
  }

  onDateChange(): void {
    if (this.selectedDate < this.today) {
      this.selectedDate = this.today;
      this.show('A data nao pode ser anterior a hoje', 'error');
    }
  }

  reserveRoom(): void {
    if (!this.selectedRoom) {
      this.show('Selecione uma sala', 'error');
      return;
    }

    if (!this.selectedStudent) {
      this.show('Selecione um aluno', 'error');
      return;
    }

    const startAt = `${this.selectedDate}T${this.startTime}:00`;
    const endAt = `${this.selectedDate}T${this.endTime}:00`;

    const body = {
      userId: this.selectedStudent.id,
      roomId: this.selectedRoom.id,
      startAt,
      endAt
    };

    this.submitting = true;

    this.reservationsService.create(body).subscribe({
      next: () => {
        this.submitting = false;
        this.show('Reserva criada com sucesso', 'success');

        this.loadReservations();
        this.loadRooms();

        this.currentStep = 1;
        this.selectedLibrary = null;
        this.selectedRoom = null;
        this.selectedStudent = null;
        this.filteredRooms = [];
      },
      error: (err) => {
        this.submitting = false;
        this.show(err.error?.message || 'Erro ao reservar sala', 'error');
      }
    });
  }

  show(message: string, type: 'success' | 'error'): void {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;

    setTimeout(() => {
      this.showToast = false;
      this.cdr.detectChanges();
    }, 3000);
  }

}
