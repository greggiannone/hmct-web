import { Component, OnInit } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { listAnimation } from './user-list.animation';


@Component({
  selector: 'hmct-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  animations: [listAnimation],
})
export class UserListComponent implements OnInit {

  users$: Observable<User[]>;

  constructor(private chat: ChatService) {
    this.users$ = chat.getUsers$();
  }

  ngOnInit() {
  }

  trackElement(index: number, element: User): string {
    return element ? element.$key : '';
  }

}
