import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, NgZone } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';
import { ForgotPasswordDialogComponent } from '../forgot-password-dialog/forgot-password-dialog.component';

@Component({
  selector: 'hmct-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit, AfterViewInit {


  @ViewChild('emailInput') emailInput: ElementRef;

  email: string;
  password: string;
  showPassword = false;

  constructor(
    private afAuth: AngularFireAuth,
    public auth: AuthService,
    private ngZone: NgZone,
    private router: Router,
    private dialog: MatDialog) { }

  ngOnInit() {
  }

  login(): void {
    this.auth.login(this.email, this.password)
    .catch(error => {
      this.dialog.open(ErrorDialogComponent, {
        data: {
          message: error,
        }
      });
    });
  }

  ngAfterViewInit(): void {
    if (this.emailInput) {
      // Use settimeout to not get any change detection errors
      setTimeout(() => {
        this.emailInput.nativeElement.focus();
      });
    }
  }

  forgotPassword(): void {
    this.dialog.open(ForgotPasswordDialogComponent);
  }

  signInWithGoogle(): void {
    this.auth.signInWithGoogle()
    .catch(error => {
      this.ngZone.run(e => {
        console.log('error signing in with google', e);
        this.dialog.open(ErrorDialogComponent, {
          data: {
            message: e,
          }
        });
      });
    });
  }

}
