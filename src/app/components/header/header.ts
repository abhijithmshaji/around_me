import { ChangeDetectorRef, Component, effect, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { Auth } from '../../services/auth/auth';
import { faUserCircle } from '@fortawesome/free-regular-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { User } from '../../services/user/user';


@Component({
  selector: 'app-header',
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, RouterLink, RouterModule, FaIconComponent],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header implements OnInit {
  private baseUrl = 'http://localhost:5000'; // backend URL
  public isLoggedIn: boolean = false
  public faProfile = faUserCircle;
  public profileImage!: any;
  constructor(private router: Router, private authService: Auth, private cdr: ChangeDetectorRef, private userService: User) {
    effect(() => {
      const newImg = this.userService.profileImageSignal();
      if (newImg) this.profileImage = newImg;
    });
  }
  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn;
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    this.profileImage = this.baseUrl+ user.profileImage || null;


    this.cdr.detectChanges()
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
  menuItems = [
    { label: 'Home', path: '/' },
    { label: 'Events', path: '/filter-event' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' }
  ];
}
