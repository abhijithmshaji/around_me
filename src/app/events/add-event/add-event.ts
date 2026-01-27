import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray, FormControl } from '@angular/forms';
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

  public EventStep = EventStep;
  public currentStep = EventStep.Edit;
  public imagePreviews: string[] = [];
  public timeSlots: string[] = [];

  public eventForm!: FormGroup;

  public hostId: string = "";
  public hostName: string = "";
  public hostImage: string = "";
  public defaultImg = '/assets/images/user.png'
  public pickedLocation: any = null

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private eventService: EventService,
    private router: Router
  ) { }

  ngOnInit(): void {

    this.generateTimeSlots();

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    this.hostId = user?.id || "";
    this.hostName = user?.name || "";
    this.hostImage = user?.profileImage ? "http://localhost:5000" + user.profileImage : this.defaultImg;

    this.eventForm = this.fb.group({
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
      tickets: this.fb.array([]),   // correct dynamic FormArray

      host: [this.hostId, Validators.required],
      contact: ['']
    });
  }

  private generateTimeSlots() {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute of [0, 30]) {   // 30 min interval
        const suffix = hour >= 12 ? 'PM' : 'AM';
        const adjusted = hour % 12 || 12;
        const formatted = `${adjusted}:${minute.toString().padStart(2, '0')} ${suffix}`;
        times.push(formatted);
      }
    }
    this.timeSlots = times;
  }

  /* Form Getters */
  get banners(): FormArray {
    return this.eventForm.get('banners') as FormArray;
  }

  get tickets(): FormArray {
    return this.eventForm.get('tickets') as FormArray;
  }
  getTicketNameControl(i: number): FormControl {
    return this.tickets.at(i).get('ticketName') as FormControl;
  }

  getTicketPriceControl(i: number): FormControl {
    return this.tickets.at(i).get('ticketPrice') as FormControl;
  }

  /* Step Navigation */
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

  /* Banner Upload */
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
  

  /* Ticket Handling */
  public addTicket(): void {
    const ticketGroup = this.fb.group({
      ticketName: ['', Validators.required],
      ticketPrice: ['', [Validators.required, Validators.min(0)]]
    });

    this.tickets.push(ticketGroup);
  }

  public removeTicket(index: number): void {
    this.tickets.removeAt(index);
  }

  /* Submit Event */
  public submitEvent(): void {
    if (this.eventForm.invalid) {
      this.eventForm.markAllAsTouched();
      
      return;
    }
    
    const formData = new FormData();
    
    const formValues = this.eventForm.getRawValue();
    console.log(this.eventForm.value);

    // Append simple fields
    formData.append('title', formValues.title);
    formData.append('category', formValues.category);
    formData.append('startDate', formValues.startDate);
    formData.append('startTime', formValues.startTime);
    formData.append('endTime', formValues.endTime);
    formData.append('location', formValues.location);
    formData.append('description', formValues.description);

    formData.append('lat', formValues.lat);
    formData.append('lng', formValues.lng);

    formData.append('isTicketed', formValues.isTicketed.toString());

    // Append dynamic tickets list
    formData.append('tickets', JSON.stringify(this.tickets.value));

    // Host
    formData.append('host', this.hostId);
    formData.append('contact', formValues.contact);

    // Append banner images
    this.banners.controls.forEach((control) => {
      if (control.value instanceof File) {
        formData.append('banners', control.value);
      }
    });

    this.eventService.addEvents(formData).subscribe({
      next: (res) => {
        alert("Event created successfully!");
        this.router.navigate(['/filter-event']);
      },
      error: (err) => {
        console.error("Error creating event:", err);
        alert("Failed to create event");
      }
    });
  }

  /* Location Picker Callback */
  onLocationPicked(loc: any) {
    this.pickedLocation = loc;

    this.eventForm.patchValue({
      location: loc.address,
      lat: loc.lat,
      lng: loc.lng
    });
  }

  /* Location Search */
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
