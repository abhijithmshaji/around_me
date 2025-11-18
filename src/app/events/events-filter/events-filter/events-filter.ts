import { ChangeDetectorRef, Component } from '@angular/core';
import { EventService } from '../../../services/event/event-service';
import { EventCard } from "../../event-card/event-card";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-events-filter',
  imports: [EventCard, FormsModule],
  templateUrl: './events-filter.html',
  styleUrl: './events-filter.scss'
})
export class EventsFilter {
  public eventsList: any[] = [];
  public filteredEvents: any[] = [];
  public selectedDate: string | null = null;
  public customSelectedDate: string | null = null;

  // Filters
  public selectedPrice: string | null = null;
  public selectedCategory: string | null = null;
  public selectedFormat: string | null = null;

  public sortBy: string = 'Relevance';

  constructor(private eventService: EventService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.eventService.getEvents().subscribe(res => {
      this.eventsList = res || [];
      this.filteredEvents = this.eventsList
      
      this.cdr.detectChanges();
      
    });
  }

  public setDateFilter(type: string) {
    this.selectedDate = type;

    if (type !== 'Custom') {
      this.customSelectedDate = null;
      this.applyFilters();
    }
  }

  public onCustomDateSelected(event: any) {
    this.customSelectedDate = event.target.value;
    this.applyFilters();
  }

  public applyFilters() {
    this.filteredEvents = this.eventsList.filter(event => {

      // Price filter
      if (this.selectedPrice === 'Free' && event.isTicketed) return false;
      if (this.selectedPrice === 'Paid' && !event.isTicketed) return false;

      // Date filter
      if (this.selectedDate === 'Today') {
        const today = new Date().toDateString();
        if (new Date(event.startDate).toDateString() !== today) return false;
      }

      if (this.selectedDate === 'Tomorrow') {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        if (new Date(event.startDate).toDateString() !== tomorrow.toDateString()) return false;
      }

      if (this.selectedDate === 'Weekend') {
        const day = new Date(event.startDate).getDay(); // 0 Sunday, 6 Saturday
        if (day !== 0 && day !== 6) return false;
      }

      if (this.selectedDate === 'Custom' && this.customSelectedDate) {
        const selected = new Date(this.customSelectedDate).toDateString();
        const eventDate = new Date(event.startDate).toDateString();

        if (eventDate !== selected) return false;
      }

      // Category filter
      if (this.selectedCategory && event.category !== this.selectedCategory) return false;

      return true;
    });

    this.sortResults();
  }

  public sortResults() {
    if (this.sortBy === 'Latest') {
      this.filteredEvents.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
    }
    if (this.sortBy === 'Price Low to High') {
      this.filteredEvents.sort((a, b) => a.ticketPrice - b.ticketPrice);
    }
    if (this.sortBy === 'Price High to Low') {
      this.filteredEvents.sort((a, b) => b.ticketPrice - a.ticketPrice);
    }
  }
}
