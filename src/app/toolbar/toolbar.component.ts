import { Component, OnInit, Input } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { User } from '../models/User';
import { Channel } from '../models/Channel';
import map from 'lodash/map';
import { ToolbarService } from './toolbar.service';
import { AuthService } from '../auth.service';

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
    private _db: AngularFireDatabase,
    private _toolbarService: ToolbarService,
    private _authService: AuthService
  ) { }

  ngOnInit() {
    this._db.object('channels').valueChanges().take(1).subscribe(channels => {
      // map over channels and push to our channels array that populates the sidebar
      map(channels, (channel, key) => {
        this.channels.push({
          key,
          name: channel.name
        });
      });
    });

    // hack to only get latest added channel and append to channel list
    this._db.list('/channels', ref => {
      return ref
        .orderByChild('timestamp')
        .startAt(Date.now())
        .limitToLast(1);
    })
    .snapshotChanges()
    .takeUntil(this._authService.loggedOut$)
    .subscribe(channels => {
      channels.forEach(channel => {
        this.channels.push({
          key: channel.key,
          name: channel.payload.val().name
        });
      });
    });
  }

  onChannelClick(channel: Channel) {
    this._toolbarService.selectChannel(channel);
  }

}