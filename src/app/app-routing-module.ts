import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TelaDeLogin } from './page/Login/tela-de-login/tela-de-login';
import { PainelAdM } from './page/ADM/painel-ad-m/painel-ad-m';
import { UsersComponent } from './page/ADM/users/users';
import { Libraries } from './page/ADM/libraries/libraries';
import { BibliotecaComponent } from './page/Aluno/biblioteca/biblioteca';
import { RoomsComponent } from './page/ADM/rooms/rooms';
import { ReservasAdm } from './page/ADM/reservas-adm/reservas-adm';

const routes: Routes = [
  {path: '', component: TelaDeLogin},
  {path: 'painel', component:  PainelAdM},
  {path: 'dashboard', component:  PainelAdM},
  {path: 'users', component: UsersComponent},
  {path: 'libraries', component: Libraries},
  {path: 'roomaluno', component: BibliotecaComponent},
  {path: 'rooms', component: RoomsComponent},
  {path: 'reservasadm', component: ReservasAdm}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
