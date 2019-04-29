import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'hmct-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.scss']
})
export class ChatRoomComponent implements OnInit {

  hasScrolledToBottom = false;

  @ViewChild('feedScroll') feedScroll: ElementRef;

  constructor(private chat: ChatService) {
    this.chat.getMessages$().subscribe(messages => {
      // First time that the page loads, transport to the bottom as fast as possible
      if (!this.hasScrolledToBottom) {
        this.scrollToBottom();
        this.hasScrolledToBottom = true;
      } else {
        // If the user is near the bottom when a new message comes in, auto-scroll
        const bottomPercentage =
          (this.feedScroll.nativeElement.scrollTop + this.feedScroll.nativeElement.offsetHeight) /
          this.feedScroll.nativeElement.scrollHeight;
        if (bottomPercentage > 0.9) {
          this.scrollToBottom();
        }
      }
    });
  }

  ngOnInit(): void {
  }

  scrollToBottom(): void {
    setTimeout(() => {
      this.feedScroll.nativeElement.scrollTo({
        top: this.feedScroll.nativeElement.scrollHeight,
      });
    }, 0);
  }

  onMessageSent(): void {
    this.scrollToBottom();
  }

}
