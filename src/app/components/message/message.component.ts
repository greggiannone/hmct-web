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

  parseMessage(message: string) {
    const words = message.split(' ');
    for (let i = 0; i < words.length; i++) {
      words[i] = this.processWord(words[i]);
    }
    return words.join(' ');
  }

  processWord(word: string): string {

    // Firebase uploaded images
    if (/(https:\/\/firebasestorage.googleapis.com\/.+$)/.test(word)) {
      return word.replace(/(https:\/\/firebasestorage.googleapis.com\/.+$)/,
        '<a href=\"$1\" target=\"_blank\"><img src=\"$1\" class=\"message__image\"></a>');
    }

    // Regular image urls
    if (/(https?:\/\/[^\s]+\.(?:jpg|gif|png))/.test(word)) {
      return word.replace(/(https?:\/\/[^\s]+\.(?:jpg|gif|png))/,
        '<a href=\"$1\" target=\"_blank\"><img src=\"$1\" class=\"message__image\"></a>');
    }

    // Links
    if (/(https?:\/\/[^\s]+)/.test(word)) {
      return word.replace(/(https?:\/\/[^\s]+)/, '<a href=\"$1\" target=\"_blank\">$1</a>');
    }

    return word;
  }

}
