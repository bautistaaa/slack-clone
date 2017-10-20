import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { User } from '../models/User';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  user: User;
  constructor(private _authService: AuthService) { }

  ngOnInit() {
    this._authService.currentUser$.subscribe(user => {
      this.user = user;
    });
  }

}
