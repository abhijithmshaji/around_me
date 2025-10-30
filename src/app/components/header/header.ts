import { Component } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import { Router } from '@angular/router';


@Component({
  selector: 'app-header',
  imports: [MatToolbarModule, MatButtonModule, MatIconModule],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {


  constructor(private router:Router){}

    logout() {
    // Clear auth token or user data
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Redirect to login page
    this.router.navigate(['/']);
  }
}
