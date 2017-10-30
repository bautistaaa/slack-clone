import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { AngularFireDatabase } from 'angularfire2/database';
import { ToolbarService } from '../toolbar/toolbar.service';
import { Channel } from '../models/Channel';
import map from 'lodash/map';
import { Message } from '../models/Message';
import { User } from '../models/User';
import 'rxjs/add/operator/distinctUntilChanged';

@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.component.html',
  styleUrls: ['./chatroom.component.scss']
})
export class ChatroomComponent implements OnInit {
  @Input()
  user: User;

  messages: Message[] = [];
  channel: Channel;

  constructor(
    private _authService: AuthService,
    private _router: Router,
    private _db: AngularFireDatabase,
    private _toolbarService: ToolbarService
  ) { }

  ngOnInit() {
    this._toolbarService.currentChannel
      .distinctUntilChanged()
      .subscribe(channel => {
        if (channel) {
          this.channel = channel;
          this._db.list(`/messages/${this.channel.key}`)
            .snapshotChanges()
            .subscribe(actions => {
              this.messages = [];
              actions.forEach(action => {
                const payload = action.payload.val();
                this.messages.push({
                  userId: payload.userId,
                  message: payload.message,
                  timestamp: payload.timestamp,
                  userName: payload.userName,
                  photoUrl: payload.photoUrl
                });
              });
            });
        }
      });
  }

  onLogoutButtonClick() {
    this._authService.logout().then(() => this._router.navigate(['/login']));
  }

  onAddMessage(message: string) {
    if (message !== '') {
      const messages = this._db.list(`/messages/${this.channel.key}`);

      messages.push(
        {
          userName: this.user.username,
          message: message,
          timestamp: new Date().toISOString(),
          photoUrl: this.user.photoUrl
        }
      );
    }
  }
}
