import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsFilter } from './events-filter';

describe('EventsFilter', () => {
  let component: EventsFilter;
  let fixture: ComponentFixture<EventsFilter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventsFilter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventsFilter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
