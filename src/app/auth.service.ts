import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';

import * as firebase from 'firebase/app';
import { User } from './models/User';
import { AngularFireDatabase } from 'angularfire2/database';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class AuthService {
  user: Observable<firebase.User>;
  auth: firebase.auth.Auth;
  private currentUserSubject = new BehaviorSubject<User>(null);
  currentUser$: Observable<User> = this.currentUserSubject.asObservable();

  constructor(
    private _afAuth: AngularFireAuth,
    private _db: AngularFireDatabase
  ) {
    console.log('construct auth service')
    this.user = this._afAuth.authState;
    this.auth = this._afAuth.auth;
    this._afAuth.auth.onAuthStateChanged(user => {
      console.log(user);
      if (user) {
        const userId = user.uid;
        console.log('query by userid ', userId);
        this._db.list(`/users/${userId}`).$ref.on('value', (snapshot) => {
          console.log(snapshot.val());
          let userSnapshot = snapshot.val();
          let currentUser: User = {
            email: userSnapshot.email,
            uid: userSnapshot.uid,
            username: userSnapshot.username,
            photoUrl: userSnapshot.photoURL
          };
          console.log('current user info ', currentUser);

          this.currentUserSubject.next(currentUser);
        });
      }
    })
  }

  isAuthenticated() {
    return this.user.subscribe(user => user);
  }

  createUser(email: string, password: string) {
    return this._afAuth.auth.createUserWithEmailAndPassword(email, password);
  }

  login(email: string, password: string) {
    return this._afAuth.auth.signInWithEmailAndPassword(email, password);
  }

  logout() {
    return this._afAuth.auth.signOut();
  }
}