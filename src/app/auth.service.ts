import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';

import * as firebase from 'firebase/app';

@Injectable()
export class AuthService {
  user: Observable<firebase.User>;
  auth: firebase.auth.Auth;
  constructor(private _afAuth: AngularFireAuth) {
    this.user = this._afAuth.authState;
    this.auth = this._afAuth.auth;
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