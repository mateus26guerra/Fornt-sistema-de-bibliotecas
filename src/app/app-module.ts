import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { TelaDeLogin } from './page/Login/tela-de-login/tela-de-login';
import { PainelAdM } from './page/ADM/painel-ad-m/painel-ad-m';
import { Sidebar } from './components/sidebar/sidebar';
import { UsersComponent } from './page/ADM/users/users';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { Libraries } from './page/ADM/libraries/libraries';
import { BibliotecaComponent } from './page/Aluno/biblioteca/biblioteca';
import { RoomsComponent } from './page/ADM/rooms/rooms';
import { ReservasAdm } from './page/ADM/reservas-adm/reservas-adm';
@NgModule({
  declarations: [
    App,
    TelaDeLogin,
    PainelAdM,
    Sidebar,
    UsersComponent,
    Libraries,
    BibliotecaComponent,
    RoomsComponent,
    ReservasAdm

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
      FormsModule,

    HttpClientModule,

    RouterModule,

  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideClientHydration(withEventReplay())
  ],
  bootstrap: [App]
})
export class AppModule { }



