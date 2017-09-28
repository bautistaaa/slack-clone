import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

import * as firebase from 'firebase/app';
import { Router } from '@angular/router';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
  user: firebase.User;
  channels: FirebaseListObservable<any>;
  
  constructor(
    public authService: AuthService,
    private _router: Router,
    private _db: AngularFireDatabase
  ) { 
    this.channels = _db.list('/channels');
  }

  ngOnInit() {
    this.authService.user.subscribe(user => {
      this.user = user;
    })
  }

  onCreateChannelButtonClick() {
    this._router.navigate(['/channel']);
  }

  onChannelClick(name: string) {
    console.log('channel clicked ', name);
  }
}
