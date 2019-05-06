import { Injectable } from '@angular/core';
import { AngularFireList, AngularFireDatabase, QueryFn } from 'angularfire2/database';
import { ChatMessage } from '../models/chat-message.model';
import { Observable } from 'rxjs';
import { AngularFireAuth } from 'angularfire2/auth';
import { User } from '../models/user.model';
import { AuthService } from './auth.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  user: firebase.User;
  extendedUser: User;
  chatMessages: AngularFireList<ChatMessage>;
  chatMessage: ChatMessage;
  username: Observable<string>;

  constructor(private db: AngularFireDatabase, private afAuth: AngularFireAuth, private auth: AuthService) {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.user = user;
        this.getUser().subscribe(u => this.extendedUser = u);
      } else {
        this.user = undefined;
        this.extendedUser = undefined;
      }
    });
  }

  getUser() {
    const userId = this.user.uid;
    const path = `/users/${userId}`;
    return this.db.object<User>(path).valueChanges();
  }

  sendMessage(message: string): Promise<any> {
    if (!message || message.length === 0) {
      return Promise.reject('Message cannot be empty');
    }

    this.chatMessages = this.getMessagesInternal$();
    return this.chatMessages.push({
      message,
      uid: this.auth.currentUid,
      timestamp: new Date().toUTCString(),
      username: this.extendedUser.displayName,
    });
  }

  private getMessagesInternal$(): AngularFireList<ChatMessage> {
    return this.db.list<ChatMessage>('messages', ref => ref.limitToLast(50));
  }

  getMessages$(): Observable<ChatMessage[]> {
    return this.getMessagesInternal$().snapshotChanges().pipe(map(messages => {
      return messages.map(m => {
        return { $key: m.key, ...m.payload.val() };
      });
    }));
  }

  getUsers$(): Observable<User[]> {
    const path = '/users';
    return this.db.list<User>(path).snapshotChanges().pipe(map(users => {
      return users.map(m => {
        return { $key: m.key, ...m.payload.val() };
      });
    }));
  }
}
