import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { EventService } from '../../services/event/event-service';

enum EventStep {
  Edit = 1,
  Banner,
  Ticketing,
  Review
}

@Component({
  selector: 'app-add-event',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-event.html',
  styleUrl: './add-event.scss'
})
export class AddEvent implements OnInit{
  EventStep = EventStep; // expose enum for template
  currentStep = EventStep.Edit;
  imagePreviews: string[] = [];

  eventForm: FormGroup;

  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef, private eventService: EventService) {
    this.eventForm = this.fb.group({
      // Step 1: Event Details
      title: ['', Validators.required],
      category: ['', Validators.required],
      startDate: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      location: ['', Validators.required],
      description: [''],

      // Step 2: Banner
      banners: this.fb.array([]),

      // Step 3: Ticketing
      isTicketed: [true],
      ticketName: [''],
      ticketPrice: ['']
    });
  }
  ngOnInit(): void {
    
  }

  // convenience getter
  get banners(): FormArray {
    return this.eventForm.get('banners') as FormArray;
  }

  nextStep() {
    if (this.currentStep < EventStep.Review) {
      this.currentStep++;
    }
  }

  prevStep() {
    if (this.currentStep > EventStep.Edit) {
      this.currentStep--;
    }
  }

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const files = Array.from(input.files);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreviews.push(e.target.result);
        this.cdr.detectChanges(); // ✅ force Angular to update the DOM
      };
      reader.readAsDataURL(file);

      this.banners.push(this.fb.control(file));
    });

    // reset file input to allow re-selecting same image if needed
    input.value = '';
  }

  // ✅ remove image from FormArray + preview
  removeImage(index: number): void {
    this.banners.removeAt(index);
    this.imagePreviews.splice(index, 1);
  }

  // optional: for debugging
  submitEvent(): void {
    if (this.eventForm.invalid) return;

    const formData = new FormData();

    // ✅ Step 1: Append all text fields
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

    // ✅ Step 2: Append all files under the SAME field name 'banners'
    this.banners.controls.forEach((control) => {
      const file = control.value;
      if (file instanceof File) {
        formData.append('banners', file);
      }
    });

    // ✅ Step 3: Send FormData (not JSON)
    this.eventService.addEvents(formData).subscribe({
      next: (res) => console.log('Event created:', res),
      error: (err) => console.error('Error creating event:', err)
    });
  }


}
