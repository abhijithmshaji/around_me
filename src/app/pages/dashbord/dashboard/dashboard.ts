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

  public eventsList: any[] = [];
  public filteredEvents: any[] = [];

  constructor(
    private userService: User,
    private eventService: EventService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.loadEvents();
  }

  // 🚀 Load events + wishlist properly
  private loadEvents() {
    const localUser = JSON.parse(localStorage.getItem("user") || "{}");

    if (!localUser.id) {
      // User not logged in → load events normally
      this.loadEventsWithoutWishlist();
      return;
    }

    // 1️⃣ Fetch user with wishlist
    this.userService.getUserById(localUser.id).subscribe({
      next: (userRes: any) => {
        const rawList = userRes.user.wishlist || [];

        const wishlist: string[] = Array.isArray(rawList[0]) ? rawList[0] : rawList;

        // 2️⃣ Load events and apply wishlist flags
        this.loadEventsWithWishlist(wishlist);
      }
    });
  }

  public onWishlistChanged(data: { eventId: string; isWishlisted: boolean }) {

  // Update the main list
  this.eventsList = this.eventsList.map(event =>
    event._id === data.eventId
      ? { ...event, isWishlisted: data.isWishlisted }
      : event
  );

  // Update the filtered list
  this.filteredEvents = this.filteredEvents.map(event =>
    event._id === data.eventId
      ? { ...event, isWishlisted: data.isWishlisted }
      : event
  );
}


  // 🚀 Case: User not logged in
  private loadEventsWithoutWishlist() {
    this.eventService.getEvents().subscribe(res => {
      this.eventsList = res || [];
      this.filteredEvents = [...this.eventsList];
      this.cdr.detectChanges();
    });
  }

  // 🚀 Case: User logged in (wishlist applied)
  private loadEventsWithWishlist(wishlist: string[]) {
    this.eventService.getEvents().subscribe({
      next: (res: any[]) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Filter only future events
        let events = (res || []).filter(event => {
          const eventDate = new Date(event.startDate);
          eventDate.setHours(0, 0, 0, 0);
          return eventDate >= today;
        });

        // ⭐ Mark wishlisted events
        events = events.map(event => ({
          ...event,
          isWishlisted: wishlist.includes(event._id)
        }));

        this.eventsList = events;
        this.filteredEvents = [...events];
        this.cdr.detectChanges();
      }
    });
  }

  // ------------------------------
  //  UI Filters (Today, Tomorrow…)
  // ------------------------------

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

  get filteredList() {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    switch (this.activeTab) {
      case 'Today':
        return this.eventsList.filter(e => new Date(e.startDate).toDateString() === today.toDateString());

      case 'Tomorrow':
        return this.eventsList.filter(e => new Date(e.startDate).toDateString() === tomorrow.toDateString());

      case 'This Weekend':
        return this.eventsList.filter(e => [0, 6].includes(new Date(e.startDate).getDay()));

      case 'Free':
        return this.eventsList.filter(e => e.isTicketed === false);

      default:
        return this.eventsList;
    }
  }

  setTab(tab: string) {
    this.activeTab = tab;
  }

}
