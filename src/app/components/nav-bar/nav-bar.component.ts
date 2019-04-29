import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';
import { ScreenService } from 'src/app/services/screen.service';

@Component({
  selector: 'hmct-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {

  constructor(
    public auth: AuthService,
    public chat: ChatService,
    public screen: ScreenService) { }

  ngOnInit() {
  }

  logout(): void {
    this.auth.logout();
  }

}
