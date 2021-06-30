import { Injectable, Injector } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
  JsonpClientBackend,
} from '@angular/common/http';
import { catchError, map, retry } from 'rxjs/operators';
import { User } from '../models/user';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AlertService } from 'ngx-alerts';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  token: any;
  user: User;
  error: any;
  id: string;

  authUrl = 'http://localhost:3000/users/authenticate';
  regUrl = 'http://localhost:3000/users/register';
  editUrl = 'http://localhost:3000/users/';
  helper = new JwtHelperService();
  decodedToken: any;
  constructor(
    private http: HttpClient,
    private router: Router,
    private injector: Injector,
    private alertService: AlertService
  ) {}

  login(user: User) {
    return this.http.post(this.authUrl, user).pipe(
      map((response: any) => {
        const user = response;
        if (user.success) {
          localStorage.setItem('token', user.token);
          this.decodedToken = this.helper.decodeToken(user.token);
          console.log('User logged in!');
          console.log('success: ', user.success);
          console.log(this.decodedToken);
          this.alertService.success(
            `${this.decodedToken.data.username} logged in!`
          );
          this.router.navigate(['/']);
        } else {
          console.log('Invalid username or password!');
          this.alertService.warning('Invalid username or password!');
          // this.router.navigate(['/']);
        }
      })
    );
  }

  register(user: User) {
    return this.http.post(this.regUrl, user).pipe(
      map((response: any) => {
        const user = response;

        if (user.success) {
          this.alertService.success('User registered!');
          this.alertService.info('Now you can log in!');
          console.log(user.msg);
          this.router.navigate(['/']);
        } else {
          console.log('Something went wrong!');
          this.alertService.warning('Something went wrong!');
          this.router.navigate(['/']);
        }
      })
    );
  }

  edit(user: User) {
    this.token = localStorage.getItem('token');
    this.decodedToken = this.helper.decodeToken(this.token);
    let id = this.decodedToken.data._id;

    const headers = {
      Authorization: this.token,
    };

    return this.http.put(this.editUrl + id, user, { headers }).pipe(
      map((response: any) => {
        const user = response;
        console.log(user);
        localStorage.setItem('token', user.token);

        if (user.token) {
          this.alertService.success('User updated!');
          this.router.navigate(['/']).then(() => {
            window.location.reload();
          });
        } else {
          this.alertService.warning('Cannot edit profile!');
          console.log('Something went wrong!');

          this.router.navigate(['/']);
        }
      })
    );
  }

  deleteUser() {
    this.token = localStorage.getItem('token');
    this.decodedToken = this.helper.decodeToken(this.token);
    let id = this.decodedToken.data._id;

    const headers = {
      Authorization: this.token,
    };

    return this.http.delete(this.editUrl + id, { headers }).subscribe(() => {
      this.alertService.success('User deleted!');
      localStorage.removeItem('token');

      this.router.navigate(['/']).then(() => {
        // window.location.reload();
      });
      console.log('User deleted!');
    });
  }

  getProfile() {
    this.token = localStorage.getItem('token');

    const headers = {
      Authorization: this.token,
    };

    if (this.token) {
      return this.http
        .get<User>('http://localhost:3000/users/:id', { headers })
        .subscribe((result) => {
          this.user = result;
          // console.log(result);
        });
    } else {
      console.log('Error from frontend unauthorized');
      this.router.navigate(['/']);
    }
  }

  getUsers() {
    console.log('Error from frontend unauthorized');
    this.router.navigate(['/']);
  }

  loggedIn() {
    this.token = localStorage.getItem('token');
    return !this.helper.isTokenExpired(this.token);
  }
}
