import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css'],
})
export class EditProfileComponent implements OnInit {
  constructor(public authService: AuthService) {}

  ngOnInit(): void {}

  onEditSubmit(f: NgForm) {
    this.authService.edit(f.value).subscribe();
  }
}
