import { Pipe, PipeTransform } from '@angular/core';
import { User } from '../models/user.model';
import { AuthService } from '../services/auth.service';

@Pipe({
  name: 'userOrderBy'
})
export class UserOrderByPipe implements PipeTransform {

  constructor(private auth: AuthService) { }

  transform(values: User[], key?: string, reverse?: boolean) {
    if (!Array.isArray(values) || values.length <= 0) {
      return null;
    }

    return this.sort(values);
  }

  private sort(values: User[]): any[] {

    const array: any[] = values.sort((a: User, b: User): number => {
      return this.getValue(a) > this.getValue(b) ? 1 : -1;
    });
    return array;
  }

  private getValue(user: User): number {
    if (user.uid === this.auth.currentFbUser.uid) {
      return -1;
    }
    if (user.status === 'online') {
      return 0;
    }
    if (user.status === 'busy') {
      return 1;
    }
    return 2;
  }

}
