import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth/auth';
import { User } from '../../services/user/user';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {

  public registerForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private userService: User) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }


  public register() {
    if (this.registerForm.valid) {
      const userData = this.registerForm.value
      console.log('Form Data:', this.registerForm.value);
      this.userService.registerUsers(userData).subscribe({
        next: (res) => {
          console.log(res);
        },
        complete: () => {
          this.registerForm.reset()
          this.router.navigate(['/'])
        }
      })
    } else {
      // this.registerForm.markAllAsTouched();
    }
  }
  public get f() {
    return this.registerForm.controls;
  }
}
