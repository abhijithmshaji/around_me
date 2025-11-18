import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-user-profile',
  imports: [CommonModule, ReactiveFormsModule, FaIconComponent],
  templateUrl: './user-profile.html',
  styleUrls: ['./user-profile.scss']
})
export class UserProfile {

  public faCamera = faCamera;
  public profileImage: string | ArrayBuffer | null = null;

  public profileForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.profileForm = this.fb.group({

      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],

      website: ['', [
        Validators.pattern(/^(https?:\/\/)?([\w\-])+\.{1}[a-zA-Z]{2,}([\/\w\-.]*)*\/?$/)
      ]],

      company: ['', [Validators.minLength(2)]],

      phone: ['', [
        Validators.required,
        Validators.pattern(/^[6-9]\d{9}$/) // Indian phone validation
      ]],

      address: ['', [Validators.required, Validators.minLength(5)]],

      city: ['', [Validators.required]],
      country: ['', [Validators.required]],
      pincode: ['', [
        Validators.required,
        Validators.pattern(/^\d{6}$/) // Indian pincode
      ]]

    });
  }

  // Profile Image Upload
  public onPhotoSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => (this.profileImage = reader.result);
    reader.readAsDataURL(file);
  }

  public saveProfile() {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    console.log("Profile Saved:", this.profileForm.value);
    alert("Profile saved successfully!");
  }

  // Utility to get form fields easily in template
  get f() {
    return this.profileForm.controls;
  }

}
