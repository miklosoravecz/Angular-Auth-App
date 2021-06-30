import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  users: any;
  token: any;
  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    this.token = localStorage.getItem('token');

    const headers = { Authorization: this.token };
    if (this.token) {
      return this.http
        .get('http://localhost:3000/users', { headers })
        .subscribe((response) => {
          // console.log(response);
          this.users = response;
        });
    } else {
      this.authService.getUsers();
    }
  }
}
