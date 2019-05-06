import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { MatCheckboxModule, MatButtonModule, MatCardModule, MatToolbarModule, MatIconModule, MatInputModule,
  MatDialogModule, MatListModule, MatTooltipModule, MatMenuModule, MatSelectModule, MatSidenavModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChatRoomComponent } from './components/chat-room/chat-room.component';
import { ChatFormComponent } from './components/chat-form/chat-form.component';
import { FeedComponent } from './components/feed/feed.component';
import { MessageComponent } from './components/message/message.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { AuthService } from './services/auth.service';
import { ChatService } from './services/chat.service';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { environment } from 'src/environments/environment';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FlexLayoutModule } from '@angular/flex-layout';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { ErrorDialogComponent } from './components/error-dialog/error-dialog.component';
import { AuthGuard } from './guards/auth/auth.guard';
import { UserComponent } from './components/user/user.component';
import { SettingsComponent } from './components/settings/settings.component';
import { ThemeService } from './services/theme.service';
import { UserOrderByPipe } from './pipes/user-order-by.pipe';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { UserImageComponent } from './components/user-image/user-image.component';
import { FireImageComponent } from './components/fire-image/fire-image.component';
import { ForgotPasswordDialogComponent } from './components/forgot-password-dialog/forgot-password-dialog.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    ChatRoomComponent,
    ChatFormComponent,
    FeedComponent,
    MessageComponent,
    UserListComponent,
    NavBarComponent,
    LoginFormComponent,
    SignUpComponent,
    ErrorDialogComponent,
    UserComponent,
    SettingsComponent,
    UserOrderByPipe,
    UserImageComponent,
    FireImageComponent,
    ForgotPasswordDialogComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    MatCheckboxModule,
    MatToolbarModule,
    MatInputModule,
    MatDialogModule,
    MatTooltipModule,
    MatSelectModule,
    MatMenuModule,
    MatSidenavModule,
    MatListModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatIconModule,
    AngularFireModule,
    FlexLayoutModule,
    FormsModule,
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    AngularFireAuthModule,
    MatCardModule,
    AngularFireModule.initializeApp(environment.firebase),
  ],
  providers: [
    AuthService,
    ChatService,
    AuthGuard,
    ThemeService,
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    ErrorDialogComponent,
    ForgotPasswordDialogComponent,
  ]
})
export class AppModule { }
