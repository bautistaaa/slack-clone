import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { FirebaseListObservable, AngularFireDatabase } from 'angularfire2/database';
import { ToolbarService } from '../toolbar/toolbar.service';

@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.component.html',
  styleUrls: ['./chatroom.component.scss']
})
export class ChatroomComponent implements OnInit {
  messages: FirebaseListObservable<any>;

  constructor(
    private _authService: AuthService,
    private _router: Router,
    private _db: AngularFireDatabase,
    private _toolbarService: ToolbarService
  ) {
    this.messages = _db.list('/messages', {
      query: {
        equalTo: this._toolbarService.currentChannel
      }
    });
  }

  ngOnInit() {
  }

  onLogoutButtonClick() {
    this._authService.logout().then(() => this._router.navigate(['/login']));
  }

  onAddMessage(message: string) {
    if (message !== '') {

      const items = this._db.list('/messages');
      const userId = this._authService.auth.currentUser.uid;

      items.push(
        {
          user: userId,
          message: message,
          channel: this._toolbarService.currentChannel,
          timestamp: new Date().toISOString()
        }
      );

    }
  }
}
