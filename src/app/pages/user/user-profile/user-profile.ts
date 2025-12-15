import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import { User } from '../../../services/user/user';
import { Router } from '@angular/router';
import { ChangeEmail } from "../change-email/change-email";
import { ChangePassword } from "../change-password/change-password";

@Component({
  selector: 'app-user-profile',
  imports: [CommonModule, ReactiveFormsModule, FaIconComponent, ChangeEmail, ChangePassword],
  templateUrl: './user-profile.html',
  styleUrls: ['./user-profile.scss']
})
export class UserProfile implements OnInit {

  public faCamera = faCamera;
  public profileImage: string | ArrayBuffer | null = null;
  public selectedFile: File | null = null;
  public baseUrl = "http://localhost:5000";
  public profileForm: FormGroup;
  public changeEmail = false;
  public changePassword = false;
  public accountInfo = true;

  constructor(private fb: FormBuilder, private userService: User, private router: Router) {

    this.profileForm = this.fb.group({

      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['',],

      website: ['', [
        Validators.pattern(/^(https?:\/\/)?([\w\-])+\.{1}[a-zA-Z]{2,}([\/\w\-.]*)*\/?$/)
      ]],

      company: ['', [Validators.minLength(2)]],

      phone: ['', [
        Validators.required,
        Validators.pattern(/^[1-9]\d{9}$/)
      ]],

      address: ['', [Validators.required, Validators.minLength(5)]],

      city: ['', Validators.required],
      country: ['', Validators.required],

      pincode: ['', [
        Validators.required,
        Validators.pattern(/^\d{6}$/)
      ]],
      profileImage: ['']
    });
  }

  ngOnInit() {
    const userData = JSON.parse(localStorage.getItem("user") || "{}");


    // Split full name
    const fullName = userData.name || "";
    const parts = fullName.trim().split(" ");

    let first = "";
    let last = "";

    if (parts.length === 1) {
      first = parts[0];
    } else if (parts.length >= 2) {
      first = parts[0];
      last = parts.slice(1).join(" ");
    }

    // Patch values to form
    this.profileForm.patchValue({
      firstName: first,
      lastName: last,
      phone: userData.phone || "",
      address: userData.address || "",
      city: userData.city || "",
      country: userData.country || "",
      pincode: userData.pincode || "",
      website: userData.website || "",
      company: userData.company || "",
    });

    // Load existing profile image
    if (userData.profileImage) {
      this.profileImage = userData.profileImage.startsWith("/uploads")
        ? this.baseUrl + userData.profileImage
        : userData.profileImage;
    }
  }

  // Image Upload
  public onPhotoSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.selectedFile = file; // store file for upload API later

    const reader = new FileReader();
    reader.onload = () => {
      this.profileImage = reader.result; // Instant preview

      // Save to localStorage
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      user.previewProfileImage = this.profileImage; // temporary preview
      localStorage.setItem("user", JSON.stringify(user));
    };
    reader.readAsDataURL(file);
  }


  public saveProfile() {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    const formData = new FormData();

    Object.keys(this.profileForm.value).forEach(key => {
      formData.append(key, this.profileForm.value[key]);
    });

    if (this.selectedFile) {
      formData.append("profileImage", this.selectedFile);
    }

    this.userService.updateProfile(formData).subscribe({
      next: (res: any) => {
        alert("Profile updated successfully!");

        const updatedUser = {
          ...res.user,
          profileImage: res.user.profileImage.startsWith("/uploads")
            ? this.baseUrl + res.user.profileImage
            : res.user.profileImage
        };
        this.userService.profileImageSignal.set(updatedUser.profileImage);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        this.router.navigate(['/filter-event'])
      },
      error: (err) => console.log(err)
    });
  }


  get f() {
    return this.profileForm.controls;
  }

  public onClickChangeAccountInfo(){
    this.accountInfo = true;
    this.changeEmail = false;
    this.changePassword = false;
  }
  public onClickChangeEmail() {
    this.changeEmail = true;
    this.accountInfo = false;
    this.changePassword = false;
  }
    public onClickChangePassword() {
      this.changePassword = true;
    this.changeEmail = false;
    this.accountInfo = false;
  }
}