import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProfileComponent } from './components/profile/profile.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HttpErrorInterceptor } from './services/http-error.interceptor';
import { FooterComponent } from './components/footer/footer.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { DeleteComponent } from './components/delete/delete.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AlertModule } from 'ngx-alerts';
const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'users', component: DashboardComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'edit', component: EditProfileComponent },
  { path: 'delete', component: DeleteComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    DashboardComponent,
    ProfileComponent,
    FooterComponent,
    EditProfileComponent,
    DeleteComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    RouterModule.forRoot(appRoutes),
    FontAwesomeModule,
    FormsModule,
    HttpClientModule,
    AlertModule.forRoot({ maxMessages: 10, timeout: 5000, positionX: 'right' }),
  ],
  providers: [
    HttpClientModule,

    {
      provide: HTTP_INTERCEPTORS,

      useClass: HttpErrorInterceptor,

      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
