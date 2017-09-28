import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, Form } from '@angular/forms';
import { Router } from '@angular/router';
import { AngularFireDatabase } from 'angularfire2/database';

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.scss']
})
export class ChannelComponent implements OnInit {
  createChannelForm: Form;
  name = new FormControl('', [Validators.required]);
  isNewUser = false;

  constructor(
    private _router: Router,
    private _db: AngularFireDatabase
  ) { }

  ngOnInit() {
  }

  onCancelButtonClick() {
    this._router.navigate(['']);
  }

  onCreateChannelButtonClick() {
    const channels = this._db.list('/channels');
    channels.push(
      {
        name: this.name.value,
        users: []
      }
    );

    this._router.navigate(['']);
  }

}
