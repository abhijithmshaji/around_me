import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { Auth } from '../../services/auth/auth';
import { faUserCircle } from '@fortawesome/free-regular-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';


@Component({
  selector: 'app-header',
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, RouterLink, RouterModule,FaIconComponent ],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header implements OnInit{

  public isLoggedIn: boolean = false
  public faProfile = faUserCircle;
  constructor(private router: Router, private authService: Auth) { }
  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
  menuItems = [
    { label: 'Home', path: '/' },
    { label: 'Events', path: '/events' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' }
  ];
}
