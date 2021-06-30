import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.css'],
})
export class DeleteComponent implements OnInit {
  id: String;
  constructor(public authService: AuthService) {}

  ngOnInit() {}
  onDeleteSubmit() {
    this.authService.deleteUser();
  }
}
