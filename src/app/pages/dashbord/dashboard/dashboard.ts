import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { User } from '../../../services/user/user';
import { CategoryCard } from "../../../categoies/category-card/category-card";
import { EventService } from '../../../services/event/event-service';
import { EventCard } from "../../../events/event-card/event-card";

@Component({
  selector: 'app-dashboard',
  imports: [CategoryCard, EventCard],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {

  public displayName!: string
  public eventsList: any[] = []

  constructor(private userService: User, private eventService: EventService, private cdr: ChangeDetectorRef) {

  }
  ngOnInit(): void {
    const user = localStorage.getItem('user');
    if (user) {
      this.displayName = JSON.parse(user).name;
    }

    this.eventService.getEvents().subscribe({
      next: (res) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        this.eventsList = (res || []).filter((event: any) => {
          const eventDate = new Date(event.startDate);
          eventDate.setHours(0, 0, 0, 0);
          return eventDate >= today;
        });
        this.cdr.detectChanges();
      }
    });
  }
  selectedCity = 'Mumbai';
  activeTab = 'All';
  tabs = ['All', 'Today', 'Tomorrow', 'This Weekend', 'Free'];

  categories = [
    { name: 'Entertainment', image: '/assets/images/cat-entertainment.png' },
    { name: 'Educational & Business', image: '/assets/images/cat-educational.png' },
    { name: 'Cultural & Arts', image: '/assets/images/cat-cultural.png' },
    { name: 'Sports & Fitness', image: '/assets/images/cat-sports.png' },
    { name: 'Technology & Innovation', image: '/assets/images/cat-technology.png' },
    { name: 'Travel & Adventure', image: '/assets/images/cat-travel.png' },
  ];

  get filteredEvents() {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    switch (this.activeTab) {

      // case 'All': return this.eventsList

      case 'Today':
        return this.eventsList.filter(e => {
          const eventDate = new Date(e.startDate);
          return eventDate.toDateString() === today.toDateString();
        });

      case 'Tomorrow':
        return this.eventsList.filter(e => {
          const eventDate = new Date(e.startDate);
          return eventDate.toDateString() === tomorrow.toDateString();
        });

      case 'This Weekend':
        return this.eventsList.filter(e => {
          const eventDate = new Date(e.startDate);
          const day = eventDate.getDay(); // 0 = Sun, 6 = Sat
          return day === 6 || day === 0;
        });

      case 'Free':
        console.log(this.eventsList.filter(e => e.isTicketed === false));

        return this.eventsList.filter(e => e.isTicketed === false);

      default:
        return this.eventsList; // "All"
    }
  }


  setTab(tab: string) {
    this.activeTab = tab;
  }

}
