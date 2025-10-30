import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth/auth';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  public email = '';
  public password = '';


  constructor(private router: Router, private auth: Auth) { }

  public login() {
    if (this.email && this.password) {
      this.auth.loginUsers(this.email, this.password).subscribe({
        next: (res) => {
          localStorage.setItem('token', res.token)
          localStorage.setItem('user',JSON.stringify(res.user))
          this.router.navigate(['/home']);
        }
      })
    } else {
      alert('Invalid credentials');
    }
  }
  onClickSignUp() {
    this.router.navigate(['/register'])
  }
}
