import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventLocationPicker } from './event-location-picker';

describe('EventLocationPicker', () => {
  let component: EventLocationPicker;
  let fixture: ComponentFixture<EventLocationPicker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventLocationPicker]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventLocationPicker);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
