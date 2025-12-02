import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth/auth';
import { User } from '../../services/user/user';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {

  public loginForm!: FormGroup

  constructor(private fb: FormBuilder, private router: Router, private auth: Auth, private userService: User) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  public login() {
    if (this.loginForm.valid) {
      this.auth.loginUsers(this.loginForm.value.email, this.loginForm.value.password).subscribe({
        next: (res) => {
          localStorage.setItem('token', res.token)
          localStorage.setItem('user', JSON.stringify(res.user))
          this.userService.displayName.set(res.user.name);
          console.log('Logged in as:', this.userService.displayName());
          this.router.navigate(['/filter-event'], { replaceUrl: true });
          history.pushState(null, '', location.href);
          window.onpopstate = () => history.go(1);
        }
      })
    } else {
      alert('Invalid credentials');
    }
  }
  public get f() {
    return this.loginForm.controls;
  }
  public onClickSignUp() {
    this.router.navigate(['/register'])
  }
  ngOnDestroy() {
    this.userService.displayName.set('')
  }
}
