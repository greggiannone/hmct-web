import { Component, OnInit, Input } from '@angular/core';
import { ChatMessage } from 'src/app/models/chat-message.model';
import { AuthService } from 'src/app/services/auth.service';
import { Observable, BehaviorSubject, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { ChatService } from 'src/app/services/chat.service';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'hmct-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {

  @Input() message: ChatMessage;
  isOwnMessage$: Observable<boolean>;
  private subscription: Subscription;

  private userSubject = new BehaviorSubject<User | undefined>(undefined);

  get user$(): Observable<User> {
    return this.userSubject.asObservable();
  }

  constructor(private auth: AuthService, private chat: ChatService) {

    this.isOwnMessage$ = auth.currentFbUser$.pipe(map(user => {
      return user && user.uid === this.message.uid;
    }));
  }

  ngOnInit() {
    this.subscription = this.chat.getUsers().valueChanges().subscribe(users => {
      const user = users.find(u => u.uid === this.message.uid);
      if (user) {
        this.userSubject.next(user);
        this.subscription.unsubscribe();
      }
    });

  }

}
