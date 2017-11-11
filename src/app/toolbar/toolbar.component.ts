import { Component, OnInit, Input, OnDestroy } from '@angular/core';

import { Router } from '@angular/router';
import { AngularFireDatabase } from 'angularfire2/database';
import { ToolbarService } from './toolbar.service';

import map from 'lodash/map';
import { Channel } from '../models/Channel';
import { User } from '../models/User';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit, OnDestroy {
  @Input()
  user: User;
  channels: Channel[] = [];
  subscription: Subscription;
  constructor(
    private _router: Router,
    private _db: AngularFireDatabase,
    private _toolbarService: ToolbarService
  ) {
    this._db.object('channels').valueChanges().take(1).subscribe(channels => {
      map(channels, (channel, key) => {
        this.channels.push({
          key,
          name: channel.name
        });
      });
    });

    // hack to only get latest added channel and append to channel list
    this.subscription = this._db.list('/channels', ref => {
      return ref
        .orderByChild('timestamp')
        .startAt(Date.now())
        .limitToLast(1);
    })
      .snapshotChanges()
      .subscribe(actions => {
        actions.forEach(action => {
          this.channels.push({
            key: action.key,
            name: action.payload.val().name
          });
        });
      });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onCreateChannelButtonClick() {
    this._router.navigate(['/channel']);
  }

  onChannelClick(channel: Channel) {
    this._toolbarService.currentChannel.next(channel);
  }
}
