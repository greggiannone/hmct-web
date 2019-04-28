import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';

@Component({
  selector: 'hmct-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit, AfterViewInit {

  @ViewChild('emailInput') emailInput: ElementRef;

  email: string;
  password: string;
  displayName: string;
  errorMsg: string;

  constructor(
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog) { }

  ngOnInit() {
  }

  signUp(): void {
    this.authService.signUp(this.email, this.password, this.displayName)
      .then(resolve => {
        this.router.navigate(['chat']);
      })
      .catch(error => {
        this.dialog.open(ErrorDialogComponent, {
          data: {
            message: error.message
          }
        });
      });
  }

  ngAfterViewInit(): void {
    if (this.emailInput) {
      setTimeout(() => {
        this.emailInput.nativeElement.focus();
      });
    }
  }
}
