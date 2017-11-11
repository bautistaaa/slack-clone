import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';

import * as firebase from 'firebase/app';
import { User } from './models/User';
import { AngularFireDatabase } from 'angularfire2/database';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';

@Injectable()
export class AuthService {
  user: Observable<firebase.User>;
  private currentUserSubject = new BehaviorSubject<User>(null);
  currentUser$: Observable<User> = this.currentUserSubject.asObservable();
  subscription: Subscription
  ;
  constructor(
    private _afAuth: AngularFireAuth,
    private _db: AngularFireDatabase
  ) {
    this.user = this._afAuth.authState;
    this._afAuth.auth.onAuthStateChanged(user => {
      if (user) {
        const userId = user.uid;
        this.subscription = this._db.list<User>(`/users/${userId}`)
          .valueChanges<any>()
          .subscribe(userSnapshot => {
            const currentUser: User = {
              email: userSnapshot[0],
              uid: userId,
              username: userSnapshot[2],
              photoUrl: userSnapshot[1]
            };

            this.currentUserSubject.next(currentUser);
          });
      }
    });
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
    this.subscription.unsubscribe();
    return this._afAuth.auth.signOut();
  }
}
