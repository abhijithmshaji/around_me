import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { User } from '../../../services/user/user';

@Component({
  selector: 'app-change-email',
  imports: [ReactiveFormsModule],
  templateUrl: './change-email.html',
  styleUrl: './change-email.scss'
})
export class ChangeEmail {

  public emailForm!: FormGroup;
  public otpSent = false;
  public serverOtpId = '';      // OTP verification ID from backend
  public isSubmitting = false;  // disable buttons during API actions

  constructor(private fb: FormBuilder, private userService: User, private cdr: ChangeDetectorRef) {

    this.emailForm = this.fb.group(
      {
        currentEmail: [{ value: '', disabled: true }],
        newEmail: ['', [Validators.required, Validators.email]],
        confirmEmail: ['', [Validators.required, Validators.email]],
        otp: ['']
      },
      { validators: this.matchEmailsValidator }
    );

    // Load current user email into form
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user?.email) {
      this.emailForm.patchValue({ currentEmail: user.email });
    }
  }

  // -------------------------------------------------------------
  // EMAIL MATCH VALIDATOR
  // -------------------------------------------------------------
  matchEmailsValidator(control: AbstractControl) {
    const newEmail = control.get('newEmail')?.value;
    const confirmEmail = control.get('confirmEmail')?.value;

    if (newEmail && confirmEmail && newEmail !== confirmEmail) {
      return { emailMismatch: true };
    }
    return null;
  }

  // -------------------------------------------------------------
  // SEND OTP TO USER PHONE NUMBER
  // -------------------------------------------------------------
  // sendOtp() {
  //   const user = JSON.parse(localStorage.getItem('user') || '{}');

  //   if (!user.phone) {
  //     alert("Phone number missing. Please update profile before using OTP verification.");
  //     return;
  //   }

  //   this.isSubmitting = true;

  //   this.userService.sendOtp(user.phone).subscribe({
  //     next: (res: any) => {
  //       this.otpSent = true;

  //       // If backend returns an OTP verification id, store it
  //       if (res?.otpId) {
  //         this.serverOtpId = res.otpId;
  //       }

  //       this.isSubmitting = false;
  //       alert("OTP sent to your mobile number");
  //     },
  //     error: () => {
  //       this.isSubmitting = false;
  //       alert("Failed to send OTP. Try again.");
  //     }
  //   });
  // }

  // -------------------------------------------------------------
  // SUBMIT EMAIL CHANGE REQUEST
  // -------------------------------------------------------------
  public submit() {
    if (this.emailForm.invalid) {
      this.emailForm.markAllAsTouched();
      return;
    }

    // if (!this.otpSent) {
    //   alert("Please verify using OTP before continuing.");
    //   return;
    // }

    const payload = {
      newEmail: this.emailForm.getRawValue().newEmail,
      // otp: this.emailForm.value.otp,
      // otpId: this.serverOtpId   // optional, depends on backend
    };

    this.isSubmitting = true;
    this.userService.updateEmail(payload).subscribe({
      next: (res: any) => {
        this.isSubmitting = false;
        alert("Email updated successfully!");
        this.cdr.detectChanges()

        if (res?.user) {
          localStorage.setItem('user', JSON.stringify(res.user));
        }
      },
      error: (err) => {
        this.isSubmitting = false;
        console.error(err);
        alert("Failed to update email.");
      }
    });
    // this.emailForm.reset()
  }
}
