import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { FirebaseListObservable, AngularFireDatabase } from 'angularfire2/database';
import { ToolbarService } from '../toolbar/toolbar.service';
import { Channel } from '../models/Channel';
import map from 'lodash/map';
import { Message } from '../models/Message';

@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.component.html',
  styleUrls: ['./chatroom.component.scss']
})
export class ChatroomComponent implements OnInit {
  messages: Message[] = [];
  channel: Channel;

  constructor(
    private _authService: AuthService,
    private _router: Router,
    private _db: AngularFireDatabase,
    private _toolbarService: ToolbarService
  ) { }

  ngOnInit() {
    this._toolbarService.currentChannel.subscribe(channel => {
      this.channel = channel;

      this._db.list('/messages').$ref.ref.child(this.channel.key).child('/messages').on('value', (snapshot) => {
        this.messages = [];
        const messages = snapshot.val();
        map(messages, (message, key) => {
          this.messages.push({
            message: message.message,
            timestamp: message.timestamp,
            user: message.user
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
      const messages = this._db.list(`/messages/${this.channel.key}/messages`);
      const userId = this._authService.auth.currentUser.uid;

      messages.push(
        {
          user: userId,
          message: message,
          timestamp: new Date().toISOString()
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
