import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map, flatMap } from 'rxjs/operators';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { AngularFireStorageReference, AngularFireStorage } from 'angularfire2/storage';
import { HttpClient } from '@angular/common/http';
import { auth } from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private uid: string;

  get currentUid(): string {
    return this.uid;
  }

  private ref: AngularFireStorageReference;
  private loginStatusSubject = new BehaviorSubject<'loggedOut' | 'loggingIn' | 'loggedIn'>('loggedOut');

  get loginStatus$(): Observable<'loggedOut' | 'loggingIn' | 'loggedIn'> {
    return this.loginStatusSubject.asObservable();
  }

  currentUser$: Observable<User>;
  currentFirebaseUser$: Observable<firebase.User>;

  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFireDatabase,
    private storage: AngularFireStorage,
    private httpClient: HttpClient,
    private router: Router) {

    this.currentUser$ = afAuth.user.pipe(flatMap(fbUser => {
      if (fbUser) {
        const path = `/users/${fbUser.uid}`;
        return this.db.object<User>(path).valueChanges().pipe(map(user => {
          // If there is no display name, this is probably a google user's first time logging in.
          // When that happens, do everything we need to do for first time google users
          if (!user.displayName) {
            this.setGoogleAttributes(fbUser);
          }
          return user;
        }));
      } else {
        return of(undefined);
      }
    }));

    this.currentFirebaseUser$ = afAuth.user;

    this.currentFirebaseUser$.subscribe(fbUser => {
      if (fbUser) {
        this.uid = fbUser.uid;
        const status = 'online';
        this.setUserStatus(status).then(() => {
          this.loginStatusSubject.next('loggedIn');
          this.router.navigate(['chat']);
        });
      } else {
        this.uid = '';
        this.loginStatusSubject.next('loggedOut');
        this.router.navigate(['login']);
      }
    });
  }

  login(email: string, password: string): Promise<any> {
    this.loginStatusSubject.next('loggingIn');
    return this.afAuth.auth.signInWithEmailAndPassword(email, password).catch(error => {
      this.loginStatusSubject.next('loggedOut');
      return Promise.reject(error);
    });
  }

  logout(): Promise<void> {
    this.setUserStatus('offline');
    return this.afAuth.auth.signOut();
  }

  signUp(email: string, password: string, displayName: string) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password).then(credential => {
      return this.setUserData(credential.user.uid, email, displayName, status);
    });
  }

  signInWithGoogle(): Promise<any> {
    this.loginStatusSubject.next('loggingIn');
    const provider = new auth.GoogleAuthProvider();
    return this.afAuth.auth.signInWithRedirect(provider).catch(error => {
      this.loginStatusSubject.next('loggedOut');
      return Promise.reject(error);
    });
  }

  setGoogleAttributes(user: firebase.User): Promise<any> {
    const isGoogleUser = user && user.photoURL && user.displayName;
    if (isGoogleUser) {
      return this.httpClient.get(user.photoURL, { responseType: 'blob'}).toPromise().then(response => {
        const blob = new Blob([response]);
        const path = `profile_images/${user.uid}`;
        this.ref = this.storage.ref(path);
        return this.ref.put(blob).then(() => {
          return this.setUserData(user.uid, user.email, user.displayName, 'online');
        });
      });
    }
    return Promise.resolve();
  }

  sendPasswordResetEmail(email: string): Promise<void> {
    return this.afAuth.auth.sendPasswordResetEmail(email);
  }

  setUserData(uid: string, email: string, displayName: string, status: string): Promise<any> {
    const path = `users/${uid}`;
    const data = {
      uid,
      email,
      displayName,
      status,
    };

    return this.db.object(path).update(data);
  }

  setUserStatus(status: string): Promise<void> {
    const path = `users/${this.uid}`;
    const data = {
      status,
    };
    return this.db.object(path).update(data);
  }

  setUserSettings(themeClass: string, displayName: string, status: string, mood: string) {
    const path = `users/${this.uid}`;
    if (!mood) {
      mood = '';
    }
    const data = {
      themeClass,
      displayName,
      status,
      mood,
    };

    this.db.object(path).update(data)
      .catch(error => console.log(error));
  }

  setUserTheme(themeClass: string) {
    const path = `users/${this.uid}`;
    const data = {
      themeClass,
    };

    this.db.object(path).update(data)
      .catch(error => console.log(error));
  }

  setUserTyping(isTyping: boolean): void {
    const lastActive = new Date().toUTCString();
    const path = `users/${this.uid}`;
    const data = {
      lastActive,
      lastMessageActivity: isTyping ? lastActive : '',
    };

    this.db.object(path).update(data)
      .catch(error => console.log(error));
  }

}
