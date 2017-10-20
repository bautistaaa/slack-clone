import { Component, OnInit, Input } from '@angular/core';

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
  @Input()
  user: User;
  channels: Channel[] = [];

  constructor(
    private _router: Router,
    private _db: AngularFireDatabase,
    private _toolbarService: ToolbarService
  ) {
    this._db.list('/channels').$ref.once('value', (snapshot) => {
      const channels = snapshot.val();
      map(channels, (channel, key) => {
        this.channels.push({
          key,
          name: channel.name
        });
      });
    });

    // hack to only get latest added channel and append to channel list
    this._db.list('/channels')
      .$ref
      .orderByChild('timestamp')
      .startAt(Date.now())
      .limitToLast(1)
      .on('child_added', snapshot => {
        this.channels.push({
          key: snapshot.key,
          name: snapshot.val().name
        });
      });
  }

  ngOnInit() {
  }

  onCreateChannelButtonClick() {
    this._router.navigate(['/channel']);
  }

  onChannelClick(channel: Channel) {
    this._toolbarService.currentChannel.next(channel);
  }
}
