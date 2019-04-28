import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { ChatRoomComponent } from './components/chat-room/chat-room.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { AuthGuard } from './guards/auth/auth.guard';
import { SettingsComponent } from './components/settings/settings.component';

const routes: Routes = [
  { path: 'login', component: LoginFormComponent },
  { path: 'register', component: SignUpComponent },
  { path: 'chat', component: ChatRoomComponent, canActivate: [AuthGuard] },
  { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
