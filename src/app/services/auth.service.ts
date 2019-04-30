import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUserSubject = new BehaviorSubject<User | undefined>(undefined);
  private currentFbUserSubject = new BehaviorSubject<firebase.User | undefined>(undefined);
  private authState: any;
  get currentUserId(): string {
    if (this.authState) {
      return this.authState.uid;
    }
    return '';
  }

  currentUserid$: Observable<string>;

  get authenticated(): boolean {
    return this.authState !== null;
  }

  get currentUser(): User {
    return this.currentUserSubject.value;
  }

  get currentUser$(): Observable<User> {
    return this.currentUserSubject.asObservable();
  }

  get currentFbUser$(): Observable<firebase.User> {
    return this.currentFbUserSubject.asObservable();
  }

  get currentFbUser(): firebase.User {
    return this.currentFbUserSubject.value;
  }

  isAuthenticated$: Observable<boolean>;

  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFireDatabase,
    private router: Router) {

    this.isAuthenticated$ = afAuth.user.pipe(map(user => {
      if (user) {
        return true;
      }
      return false;
    }));

    afAuth.user.subscribe(user => {
      this.currentFbUserSubject.next(user);
      if (user) {
        const path = `/users/${user.uid}`;
        this.db.object<User>(path).valueChanges().subscribe(u => {
          this.currentUserSubject.next(u);
        });

      } else {
        this.currentUserSubject.next(undefined);
        this.router.navigate(['login']);
      }
    });
  }

  login(email: string, password: string): Promise<any> {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password).then(credential => {
      this.currentFbUserSubject.next(credential.user);
      const status = 'online';
      this.setUserStatus(status);
      this.router.navigate(['chat']);
    });
  }

  logout(): Promise<void> {
    this.setUserStatus('offline');
    return this.afAuth.auth.signOut();
  }

  signUp(email: string, password: string, displayName: string) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then((credential) => {
        this.authState = credential.user;
        const status = 'online';
        this.setUserData(email, displayName, status);
      });
  }

  setUserData(email: string, displayName: string, status: string) {
    const path = `users/${this.currentUserId}`;
    const data = {
      uid: this.currentUserId,
      email,
      displayName,
      status,
    };

    this.db.object(path).update(data)
      .catch(error => console.log(error));
  }

  setUserStatus(status: string) {
    const path = `users/${this.currentFbUserSubject.value.uid}`;
    const data = {
      status,
    };

    this.db.object(path).update(data)
      .catch(error => console.log(error));
  }

  setUserSettings(themeClass: string, displayName: string, status: string) {
    const path = `users/${this.currentFbUserSubject.value.uid}`;
    const data = {
      themeClass,
      displayName,
      status,
    };

    this.db.object(path).update(data)
      .catch(error => console.log(error));
  }

  setUserTheme(themeClass: string) {
    const path = `users/${this.currentFbUserSubject.value.uid}`;
    const data = {
      themeClass,
    };

    this.db.object(path).update(data)
      .catch(error => console.log(error));
  }

  setUserTyping(isTyping: boolean): void {
    const lastActive = new Date().toUTCString();
    const path = `users/${this.currentFbUserSubject.value.uid}`;
    const data = {
      lastActive,
      lastMessageActivity: isTyping ? lastActive : '',
    };

    this.db.object(path).update(data)
      .catch(error => console.log(error));
  }

}
