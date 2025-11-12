import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickStats } from './quick-stats';

describe('QuickStats', () => {
  let component: QuickStats;
  let fixture: ComponentFixture<QuickStats>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuickStats]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuickStats);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
