import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'hmct-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  @Input() user: User;

  constructor() { }

  ngOnInit() {
  }

}
