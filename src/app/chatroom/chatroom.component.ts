import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { FirebaseListObservable, AngularFireDatabase } from 'angularfire2/database';
import { ToolbarService } from '../toolbar/toolbar.service';
import { Channel } from '../models/Channel';
import map from 'lodash/map';
import { Message } from '../models/Message';
import { User } from '../models/User';
import 'rxjs/add/operator/mergeMap';

@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.component.html',
  styleUrls: ['./chatroom.component.scss']
})
export class ChatroomComponent implements OnInit {
  messages: Message[] = [];
  channel: Channel;
  user: User;
  
  constructor(
    private _authService: AuthService,
    private _router: Router,
    private _db: AngularFireDatabase,
    private _toolbarService: ToolbarService
  ) { }

  ngOnInit() {
    this._authService.currentUser$.flatMap(user => {
      this.user = user;
      return this._toolbarService.currentChannel
    }).subscribe(channel => {
      this.channel = channel;

      this._db.list(`/messages/${this.channel.key}`).$ref.on('value', (snapshot) => {
        this.messages = [];
        const messages = snapshot.val();
        map(messages, (message, key) => {
          this.messages.push({
            userId: message.userId,
            message: message.message,
            timestamp: message.timestamp,
            userName: message.userName,
            photoUrl: message.photoUrl
          });
        });
      });
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

// messages
//   channel
//     messageId
//       user
//       message
//       timestamp
