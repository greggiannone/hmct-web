import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'hmct-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {

  constructor(public auth: AuthService, private router: Router, public chat: ChatService) { }

  ngOnInit() {
  }

  logout(): void {
    this.auth.logout();
  }

}
