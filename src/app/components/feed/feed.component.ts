import { Component, OnInit } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';
import { ChatMessage } from 'src/app/models/chat-message.model';
import { Observable, combineLatest, of } from 'rxjs';
import { listAnimation } from './feed.animation';

@Component({
  selector: 'hmct-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss'],
  animations: [listAnimation]
})
export class FeedComponent implements OnInit {

  messages$: Observable<ChatMessage[]>;

  constructor(public chat: ChatService) {
    this.messages$ = chat.getMessages$();
  }

  ngOnInit() {
  }

  trackElement(index: number, element: ChatMessage): string {
    return element ? element.$key : '';
  }

}
