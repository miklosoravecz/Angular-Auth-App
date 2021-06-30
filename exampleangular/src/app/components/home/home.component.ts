import { Component, OnInit } from '@angular/core';
import {
  faSignInAlt,
  faUser,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  title = 'MEAN stack example project';
  faSignInAlt = faSignInAlt;
  faUser = faUser;
  faUsers = faUsers;
  constructor(public authService: AuthService) {}

  ngOnInit(): void {}
}
