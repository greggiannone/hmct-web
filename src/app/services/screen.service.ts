import { Injectable, EventEmitter, Output } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ScreenService {

  isMobile$: Observable<boolean>;

  @Output() openUserList = new EventEmitter<void>();

  constructor(breakpointObserver: BreakpointObserver) {
    this.isMobile$ = breakpointObserver.observe(`(max-width: 800px)`).pipe(map(result => result.matches));
  }
}
