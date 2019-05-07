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
      const aValue = this.getValue(a);
      const bValue = this.getValue(b);
      if (aValue === bValue) {
        return a.displayName.localeCompare(b.displayName);
      }
      return aValue > bValue ? 1 : -1;
    });
    return array;
  }

  private getValue(user: User): number {
    if (user.uid === this.auth.currentUid) {
      return -1;
    }
    if (user.isOnline || user.status === 'offline') {
      return 0;
    }
    return 1;
  }

}
