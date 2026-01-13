import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { User } from '../../../services/user/user';

@Component({
  selector: 'app-change-password',
  imports: [ReactiveFormsModule],
  templateUrl: './change-password.html',
  styleUrl: './change-password.scss'
})
export class ChangePassword implements OnInit {

   public passwordForm!: FormGroup;
  public hasPassword = true; // backend should tell this, default true
  public otpSent = false;
  public serverOtpId = '';

  constructor(private fb: FormBuilder, private userService: User) { }

  ngOnInit() {
    this.initForm();

    // Check if user already has a password (from DB)
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.hasPassword = user.hasPassword !== false; // default true
  }

  private initForm() {
    this.passwordForm = this.fb.group(
      {
        currentPassword: [''], // filled only if user already has password
        newPassword: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/)
          ]
        ],
        confirmNewPassword: ['', [Validators.required]],
      },
      {
        validators: this.passwordMatchValidator
      }
    );
  }

  // Validates new password === confirm password
  private passwordMatchValidator(form: FormGroup) {
    const newPass = form.get('newPassword')?.value;
    const confirm = form.get('confirmNewPassword')?.value;

    return newPass === confirm ? null : { passwordMismatch: true };
  }

  // If user does not have a password → show fields
  public startSetPassword() {
    this.hasPassword = true;
  }

  // Send OTP to verify password change
  private sendOtp(): Promise<string> {
    return new Promise((resolve, reject) => {
      const user = JSON.parse(localStorage.getItem('user') || '{}');

      if (!user.phone) {
        reject("Phone number not found.");
        return;
      }

      this.userService.sendOtp(user.phone).subscribe({
        next: (res: any) => {
          this.otpSent = true;
          this.serverOtpId = res.otpId;
          resolve(res.otpId);
        },
        error: (err) => reject(err)
      });
    });
  }

  // Submit updated password
  public async savePassword() {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    // try {
      // 1️⃣ First send OTP
      // await this.sendOtp();

      // 2️⃣ Ask user for OTP
      // const otp = prompt("Enter the OTP sent to your phone");

      // if (!otp) {
      //   alert("OTP verification cancelled.");
      //   return;
      // }

      const payload = {
        currentPassword: this.passwordForm.value.currentPassword,
        newPassword: this.passwordForm.value.newPassword,
        // otp,
        // otpId: this.serverOtpId
      };

      // 3️⃣ Submit password change request
      this.userService.updatePassword(payload).subscribe({
        next: (res: any) => {
          alert("Password updated successfully!");
        },
        error: (err) => {
          console.error(err);
          alert(err.error?.message || "Unable to update password");
        }
      });

    // } catch (error) {
    //   console.error(error);
    //   alert("Failed to send OTP");
    // }
  }

  public cancel() {
    this.passwordForm.reset();
  }

  get f() {
    return this.passwordForm.controls;
  }
}
