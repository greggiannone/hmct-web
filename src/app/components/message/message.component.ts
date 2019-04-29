import { Component, OnInit, Input } from '@angular/core';
import { ChatMessage } from 'src/app/models/chat-message.model';
import { AuthService } from 'src/app/services/auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'hmct-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {

  @Input() message: ChatMessage;
  isOwnMessage$: Observable<boolean>;

  constructor(auth: AuthService) {

    this.isOwnMessage$ = auth.currentFbUser$.pipe(map(user => {
      return user && user.uid === this.message.uid;
    }));
  }

  ngOnInit() {
  }

}
