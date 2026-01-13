import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { EventService } from '../../services/event/event-service';
import { Router } from '@angular/router';
import { EventLocationPicker } from "../../common/event-location-picker/event-location-picker/event-location-picker";

enum EventStep {
  Edit = 1,
  Banner,
  Ticketing,
  Review
}

@Component({
  selector: 'app-add-event',
  imports: [CommonModule, ReactiveFormsModule, EventLocationPicker],
  templateUrl: './add-event.html',
  styleUrl: './add-event.scss'
})
export class AddEvent implements OnInit {
  public EventStep = EventStep; // expose enum for template
  public currentStep = EventStep.Edit;
  public imagePreviews: string[] = [];

  public eventForm: FormGroup;
  public pickedLocation: any = null;
  public hostName!: string;
  public hostImage!: any;

  public selectedLocation!: {
    lat: number;
    lng: number;
    address: string;
  };

  constructor(private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private eventService: EventService,
    private router: Router) {
    this.eventForm = this.fb.group({
      // Step 1: Event Details
      title: ['', Validators.required],
      category: ['', Validators.required],
      startDate: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      location: ['', Validators.required],
      lat: [''],
      lng: [''],
      description: [''],

      banners: this.fb.array([]),

      isTicketed: [true],
      ticketName: [''],
      ticketPrice: ['']
    });
  }
  ngOnInit(): void {
    const user = localStorage.getItem('user');
    this.hostName = user ? JSON.parse(user).name : '';
    const hostImg = user ? JSON.parse(user).profileImage : '';
    this.hostImage = 'http://localhost:5000'+ hostImg
  }
  get banners(): FormArray {
    return this.eventForm.get('banners') as FormArray;
  }

  public nextStep() {
    if (this.currentStep < EventStep.Review) {
      this.currentStep++;
    }
  }

  public prevStep() {
    if (this.currentStep > EventStep.Edit) {
      this.currentStep--;
    }
  }

  public onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const files = Array.from(input.files);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreviews.push(e.target.result);
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);

      this.banners.push(this.fb.control(file));
    });

    input.value = '';
  }
  public removeImage(index: number): void {
    this.banners.removeAt(index);
    this.imagePreviews.splice(index, 1);
  }
  public submitEvent(): void {
    console.log(this.eventForm);

    if (this.eventForm.invalid) return;

    const formData = new FormData();
    formData.append('title', this.eventForm.value.title);
    formData.append('category', this.eventForm.value.category);
    formData.append('startDate', this.eventForm.value.startDate);
    formData.append('startTime', this.eventForm.value.startTime);
    formData.append('endTime', this.eventForm.value.endTime);
    formData.append('location', this.eventForm.value.location);
    formData.append('description', this.eventForm.value.description);
    formData.append('isTicketed', this.eventForm.value.isTicketed);
    formData.append('ticketName', this.eventForm.value.ticketName);
    formData.append('ticketPrice', this.eventForm.value.ticketPrice);

    this.banners.controls.forEach((control) => {
      const file = control.value;
      if (file instanceof File) {
        formData.append('banners', file);
      }
    });

    this.eventService.addEvents(formData).subscribe({
      next: (res) => {
        console.log('Event created:', res)
        this.router.navigate(['/filter-event'])
      },
      complete: () => {
        this.eventForm.reset()
      },
      error: (err) => console.error('Error creating event:', err)
    });
  }

  public onLocationPicked(loc: any) {
    this.eventForm.patchValue({
      location: loc.address
    });
  }

  // searchAddress(event: any) {
  //   const query = event.target.value;

  //   if (query.length < 3) return;

  //   fetch(`https://nominatim.openstreetmap.org/search?format=json&countrycodes=in&q=${query}`)
  //     .then(res => res.json())
  //     .then(results => {
  //       if (results.length > 0) {
  //         const place = results[0];

  //         // Set map marker via child component
  //         this.onLocationPicked({
  //           lat: place.lat,
  //           lng: place.lon,
  //           address: place.display_name
  //         });
  //       }
  //     });
  // }


  onSearchTyping(event: any) {
    const query = event.target.value;

    if (query.length < 3) return;

    fetch(`https://nominatim.openstreetmap.org/search?format=json&countrycodes=in&q=${query}`)
      .then(res => res.json())
      .then(results => {
        if (results.length === 0) return;

        const place = results[0];

        this.onLocationPicked({
          lat: Number(place.lat),
          lng: Number(place.lon),
          address: place.display_name
        });
      });
  }


}
