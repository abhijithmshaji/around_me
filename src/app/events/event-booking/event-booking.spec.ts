import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventBooking } from './event-booking';

describe('EventBooking', () => {
  let component: EventBooking;
  let fixture: ComponentFixture<EventBooking>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventBooking]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventBooking);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
