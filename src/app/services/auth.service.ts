import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map, flatMap } from 'rxjs/operators';
import { AngularFireAuth } from 'angularfire2/auth';
import { User } from '../models/user.model';
import { AngularFireStorageReference, AngularFireStorage } from 'angularfire2/storage';
import { HttpClient } from '@angular/common/http';
import { auth } from 'firebase/app';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private uid: string;

  get currentUid(): string {
    return this.uid;
  }

  private ref: AngularFireStorageReference;
  currentUser$: Observable<User>;
  currentFirebaseUser$: Observable<firebase.User>;

  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFireDatabase,
    private router: Router,
    private storage: AngularFireStorage,
    private httpClient: HttpClient) {

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
        this.setIsOnline(true);
      } else {
        this.uid = '';
      }
    });
  }

  login(email: string, password: string): Promise<any> {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }

  logout(): Promise<any> {
    return this.setIsOnline(false).then(() => {
      this.afAuth.auth.signOut().then(() => {
        this.router.navigate(['login']);
      });
    });
  }

  signUp(email: string, password: string, displayName: string) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password).then(credential => {
      return this.setUserData(credential.user.uid, email, displayName, 'available');
    });
  }

  signInWithGoogle(): Promise<any> {
    const provider = new auth.GoogleAuthProvider();
    return this.afAuth.auth.signInWithRedirect(provider);
  }

  setGoogleAttributes(user: firebase.User): Promise<any> {
    const isGoogleUser = user && user.photoURL && user.displayName;
    if (isGoogleUser) {
      return this.httpClient.get(user.photoURL, { responseType: 'blob'}).toPromise().then(response => {
        const blob = new Blob([response]);
        const path = `profile_images/${user.uid}`;
        this.ref = this.storage.ref(path);
        return this.ref.put(blob).then(() => {
          return this.setUserData(user.uid, user.email, user.displayName, 'available');
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

  setIsOnline(isOnline: boolean): Promise<void> {
    const path = `users/${this.uid}`;
    const data = {
      isOnline,
    };
    return this.db.object(path).update(data);
  }

  setUserSettings(themeClass: string, displayName: string, status: string, mood: string): Promise<void> {
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
    return this.db.object(path).update(data);
  }

  setUserTheme(themeClass: string): Promise<void> {
    const path = `users/${this.uid}`;
    const data = {
      themeClass,
    };
    return this.db.object(path).update(data);
  }

  setUserTyping(isTyping: boolean): Promise<void> {
    if (this.uid) {
      const lastActive = new Date().toUTCString();
      const path = `users/${this.uid}`;
      const data = {
        lastActive,
        lastMessageActivity: isTyping ? lastActive : '',
      };
      return this.db.object(path).update(data);
    }
  }

}
