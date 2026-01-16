import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-event-booking',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './event-booking.html',
  styleUrl: './event-booking.scss'
})
export class EventBooking {

  @Input() event: any = null;
  @Input() ticketPrice: number = 0;

  @Output() closed = new EventEmitter();
  @Output() bookingCompleted = new EventEmitter();

  public Math = Math

  public step = 1;
  public qty = 1;

  public attendeeForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.attendeeForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]]
    });
  }

  // --------------------------
  // Step Navigation
  // --------------------------
  public nextStep() {
    if (this.step === 2 && this.attendeeForm.invalid) {
      this.attendeeForm.markAllAsTouched();
      return;
    }
    this.step++;
  }

  public prevStep() {
    if (this.step > 1) this.step--;
  }

  public closeModal() {
    this.closed.emit();
  }

  // --------------------------
  // Simulate Payment
  // --------------------------
  public payNow() {
    this.bookingCompleted.emit({
      qty: this.qty,
      total: this.totalAmount(),
      attendee: this.attendeeForm.value
    });
  }

  public totalAmount() {
    return this.qty * Number(this.ticketPrice);
  }
}
