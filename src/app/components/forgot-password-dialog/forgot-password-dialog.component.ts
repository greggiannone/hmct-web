import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'hmct-forgot-password-dialog',
  templateUrl: './forgot-password-dialog.component.html',
  styleUrls: ['./forgot-password-dialog.component.scss']
})
export class ForgotPasswordDialogComponent implements OnInit {

  email = '';

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  constructor(private auth: AuthService, private ref: MatDialogRef<ForgotPasswordDialogComponent>) { }

  ngOnInit() {
  }

  sendPasswordReset(): void {
    this.auth.sendPasswordResetEmail(this.email).then(() => {
      this.ref.close(true);
    }).catch(error => {
      this.emailFormControl.setErrors( {
        firebase: error.message,
      });
    });
  }

}
