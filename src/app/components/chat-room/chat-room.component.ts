import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';
import { ScreenService } from 'src/app/services/screen.service';
import { MatSidenav } from '@angular/material';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { map } from 'rxjs/operators';
import { listAnimation } from './chat-room.animation';

@Component({
  selector: 'hmct-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.scss'],
  animations: [listAnimation],
})
export class ChatRoomComponent implements OnInit {

  hasScrolledToBottom = false;
  title = document.title;

  users$: Observable<User[]>;
  typingUsers$: Observable<User[]>;

  @ViewChild('feedScroll') feedScroll: ElementRef;
  @ViewChild(MatSidenav) sidenav!: MatSidenav;

  constructor(public chat: ChatService, public screen: ScreenService, public auth: AuthService) {

    this.users$ = chat.getUsers$();

    this.typingUsers$ = this.users$.pipe(map(users => {
      return users.filter(u => !!u.lastMessageActivity && u.uid !== this.auth.currentUid);
    }));

    this.chat.getMessages$().subscribe(messages => {
      // First time that the page loads, transport to the bottom as fast as possible
      if (!this.hasScrolledToBottom) {
        this.initialScrollToBottom(5);
        this.hasScrolledToBottom = true;
        this.resetTitle();
      } else {
        // If the user is near the bottom when a new message comes in, auto-scroll
        const bottomPercentage =
          (this.feedScroll.nativeElement.scrollTop + this.feedScroll.nativeElement.offsetHeight) /
          this.feedScroll.nativeElement.scrollHeight;
        if (bottomPercentage > 0.9) {
          this.scrollToBottom(5);
        }
      }
      if (!document.hasFocus()) {
        this.updateTitleNewMessageCount();
      }
    });

    this.screen.openUserList.subscribe(() => this.sidenav.toggle());
  }

  ngOnInit(): void {
  }

  initialScrollToBottom(retryCount: number): void {
    if (retryCount <= 0) {
      return;
    }

    this.feedScroll.nativeElement.scrollTo({
      top: this.feedScroll.nativeElement.scrollHeight,
    });

    // Because some messages take time to load, keep scrolling to bottom while they load
    setTimeout(() => {
      this.initialScrollToBottom(--retryCount);
    }, 500);
  }

  trackElement(index: number, element: User): string {
    return element ? element.$key : '';
  }

  scrollToBottom(retryCount: number): void {
    if (retryCount <= 0) {
      return;
    }

    setTimeout(() => {
      this.feedScroll.nativeElement.scrollTo({
        top: this.feedScroll.nativeElement.scrollHeight,
        behavior: 'smooth',
      });
    }, 0);

    // Because some messages take time to load, keep scrolling to bottom while they load
    setTimeout(() => {
      this.initialScrollToBottom(--retryCount);
    }, 500);
  }

  onMessageSent(): void {
    this.scrollToBottom(5);
  }

  @HostListener('window:focus', ['$event'])
  onfocus(event: FocusEvent): void {
    this.resetTitle();
  }

  updateTitleNewMessageCount(): void {
    document.title = `* ${this.title} *`;
  }

  resetTitle(): void {
    document.title = this.title;
  }
}
