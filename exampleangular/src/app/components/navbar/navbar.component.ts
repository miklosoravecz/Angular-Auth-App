import { Component, OnInit } from '@angular/core';
import { faChessRook } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from 'src/app/services/auth.service';
import { AlertService } from 'ngx-alerts';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  faChessRook = faChessRook;
  constructor(
    private alertService: AlertService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {}

  logout() {
    this.alertService.success('User logged out!');
    localStorage.removeItem('token');
    console.log('User logged out!');
  }
}
