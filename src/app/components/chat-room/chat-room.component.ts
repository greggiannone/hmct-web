import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';
import { ScreenService } from 'src/app/services/screen.service';
import { MatSidenav } from '@angular/material';

@Component({
  selector: 'hmct-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.scss']
})
export class ChatRoomComponent implements OnInit {

  hasScrolledToBottom = false;
  newMessageCount = 0;
  title = document.title;

  @ViewChild('feedScroll') feedScroll: ElementRef;
  @ViewChild(MatSidenav) sidenav!: MatSidenav;

  constructor(private chat: ChatService, public screen: ScreenService) {

    this.chat.getMessages$().subscribe(messages => {
      // First time that the page loads, transport to the bottom as fast as possible
      if (!this.hasScrolledToBottom) {
        this.scrollToBottom();
        this.hasScrolledToBottom = true;
        this.resetTitle();
      } else {
        // If the user is near the bottom when a new message comes in, auto-scroll
        const bottomPercentage =
          (this.feedScroll.nativeElement.scrollTop + this.feedScroll.nativeElement.offsetHeight) /
          this.feedScroll.nativeElement.scrollHeight;
        if (bottomPercentage > 0.9) {
          this.scrollToBottom();
        }
      }
      if(!document.hasFocus()){
        this.updateTitleNewMessageCount();
      }
    });

    this.screen.openUserList.subscribe(() => this.sidenav.toggle());
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

  @HostListener('window:focus', ['$event'])
  onfocus(event: FocusEvent): void{
    this.resetTitle();
  }

  updateTitleNewMessageCount(): void{
    this.newMessageCount++;
    var newTitle = '('+this.newMessageCount+')'+ this.title;
    document.title = newTitle;
  }

  resetTitle(): void{
    this.newMessageCount = 0;
    var titlePieces = document.title.split(')');
    //Don't want to try and access it if the title wasn't set to include a count.
    if(titlePieces.length == 2){
      document.title = titlePieces[1];
    }
    else{
      document.title = this.title;
    }
  }
}
