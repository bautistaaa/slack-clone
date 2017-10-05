import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

import { Router } from '@angular/router';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { ToolbarService } from './toolbar.service';

import map from 'lodash/map';
import { Channel } from '../models/Channel';
import { User } from '../models/User';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
  user: User;
  channels: Channel[] = [];

  constructor(
    public authService: AuthService,
    private _router: Router,
    private _db: AngularFireDatabase,
    private _toolbarService: ToolbarService
  ) {

    this._db.list('/channels').$ref.on('value', (snapshot) => {
      const channels = snapshot.val();
      map(channels, (channel, key) => {
        this.channels.push({
          key,
          name: channel.name
        });
      });
    });
  }

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.user = user;
    });
  }

  onCreateChannelButtonClick() {
    this._router.navigate(['/channel']);
  }

  onChannelClick(channel: Channel) {
    this._toolbarService.currentChannel.next(channel);
  }
}
