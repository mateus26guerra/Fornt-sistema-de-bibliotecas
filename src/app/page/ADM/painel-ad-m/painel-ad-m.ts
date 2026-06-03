import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ReservationsService } from '../../../services/reservations.service';
import { RoomsService } from '../../../services/rooms.service';
import { UsersService } from '../../../services/users.service';

@Component({
  selector: 'app-painel-ad-m',
  standalone: false,
  templateUrl: './painel-ad-m.html',
  styleUrl: './painel-ad-m.scss',
})
export class PainelAdM implements OnInit {

  reservations: any[] = [];
  rooms: any[] = [];
  users: any[] = [];
  loading = false;
  showToast = false;
  toastMessage = '';

  constructor(
    private reservationsService: ReservationsService,
    private roomsService: RoomsService,
    private usersService: UsersService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  get confirmedReservations(): number {
    return this.reservations.filter(item => item.status === 'CONFIRMED').length;
  }

  get cancelledReservations(): number {
    return this.reservations.filter(item => item.status === 'CANCELLED').length;
  }

  get todayReservations(): number {
    const today = new Date().toISOString().split('T')[0];

    return this.reservations.filter(item => item.startAt?.startsWith(today)).length;
  }

  loadDashboard(): void {
    this.loading = true;
    this.loadReservations();
    this.loadRooms();
    this.loadUsers();
  }

  loadReservations(): void {
    this.reservationsService.findAll().subscribe({
      next: (res: any) => {
        this.reservations = Array.isArray(res) ? res : res.content ?? [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.showToastMessage('Erro ao carregar reservas');
      }
    });
  }

  loadRooms(): void {
    this.roomsService.findAll().subscribe({
      next: (res: any) => {
        this.rooms = Array.isArray(res) ? res : res.content ?? [];
        this.cdr.detectChanges();
      }
    });
  }

  loadUsers(): void {
    this.usersService.findAll().subscribe({
      next: (res: any) => {
        this.users = Array.isArray(res) ? res : res.content ?? [];
        this.cdr.detectChanges();
      }
    });
  }

  getRoomCode(reservation: any): string {
    if (reservation.room?.code) {
      return reservation.room.code;
    }

    const room = this.rooms.find(item => item.id === reservation.roomId);
    return room?.code || reservation.roomId || '-';
  }

  getLibraryName(reservation: any): string {
    if (reservation.room?.library?.name) {
      return reservation.room.library.name;
    }

    const room = this.rooms.find(item => item.id === reservation.roomId);
    return room?.library?.name || '-';
  }

  getStudentName(reservation: any): string {
    if (reservation.user?.name) {
      return reservation.user.name;
    }

    const user = this.users.find(item => item.id === reservation.userId);
    return user?.name || reservation.userId || '-';
  }

  getStudentEmail(reservation: any): string {
    if (reservation.user?.email) {
      return reservation.user.email;
    }

    const user = this.users.find(item => item.id === reservation.userId);
    return user?.email || '';
  }

  showToastMessage(message: string): void {
    this.toastMessage = message;
    this.showToast = true;

    setTimeout(() => {
      this.showToast = false;
      this.cdr.detectChanges();
    }, 3000);
  }

}
