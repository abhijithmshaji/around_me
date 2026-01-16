import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { faStar, faCalendarAlt, faClock } from '@fortawesome/free-regular-svg-icons';
import { faShareAlt, faMapMarkerAlt, faTicketAlt } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { ActivatedRoute, Route, Router } from '@angular/router';
import { EventService } from '../../services/event/event-service';
import { DatePipe } from '@angular/common';
import * as L from 'leaflet';
import { User } from '../../services/user/user';
import { EventBooking } from "../event-booking/event-booking";

@Component({
  selector: 'app-event-details',
  imports: [FaIconComponent, DatePipe, EventBooking],
  templateUrl: './event-details.html',
  styleUrl: './event-details.scss'
})
export class EventDetails implements OnInit {
  public baseUrl = 'http://localhost:5000'
  public faStar = faStar;
  public faShare = faShareAlt;
  public faCalendar = faCalendarAlt;
  public faClock = faClock;
  public faMapMarker = faMapMarkerAlt;
  public faTicket = faTicketAlt;
  public event: any
  public eventBanner = ''
  private map: L.Map | null = null;
  public hostData!: any


  constructor(private route: ActivatedRoute, private eventService: EventService,
    private cdr: ChangeDetectorRef, private userService: User,private router: Router) { }
  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      console.error("No event ID found in route!");
      return;
    }

    this.eventService.getEventById(id).subscribe({
      next: (res) => {
        this.event = res;

        // FIX: Handle banner safely
        if (this.event?.banners?.length > 0) {
          this.eventBanner = this.baseUrl + this.event.banners[0].url;
        } else {
          this.eventBanner = "assets/images/placeholder-banner.png";
        }

        // FIX: Handle host safely
        let hostId = null;

        if (typeof this.event.host === "string") {
          hostId = this.event.host;
        } else if (typeof this.event.host === "object") {
          hostId = this.event.host._id;
        }

        if (hostId) {
          this.userService.getUserById(hostId).subscribe({
            next: (hostRes: any) => {
              this.hostData = hostRes.user;
              console.log("Host:", this.hostData); 
              this.cdr.detectChanges();
            },
            error: (err) => console.error("Failed to load host:", err)
          });
        }

        // FIX: Initialize map ONLY if address exists
        if (this.event?.location) {
          this.showMapFromAddress(this.event.location);
        }

        this.cdr.detectChanges();
      },

      error: (err) => console.error("Failed to load event:", err)
    });
  }

  public async showMapFromAddress(address: string) {
    const results = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
    ).then(r => r.json());

    if (results.length === 0) return;

    const lat = parseFloat(results[0].lat);
    const lon = parseFloat(results[0].lon);

    this.loadMap(lat, lon);
  }

  private loadMap(lat: number, lon: number) {
    if (this.map) this.map.remove(); // prevents double map bug

    this.map = L.map('event-map').setView([lat, lon], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18
    }).addTo(this.map);

    L.marker([lat, lon]).addTo(this.map);
  }


  public to12Hour(time: string | null): string {
    if (!time) return "";

    const date = new Date("1970-01-01T" + time);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });
  }


  public shortAddress(fullAddress: string): string {
    if (!fullAddress) return '';

    const parts = fullAddress.split(',').map(p => p.trim());

    // Find state (usually 2nd last non-number part)
    let state = '';
    for (let i = parts.length - 1; i >= 0; i--) {
      if (!/^\d+$/.test(parts[i]) && parts[i] !== 'India') {
        state = parts[i];
        break;
      }
    }

    // Find locality (the meaningful part just before district)
    let locality = '';
    for (let i = parts.length - 1; i >= 0; i--) {
      if (
        parts[i] !== state &&
        !/^\d+$/.test(parts[i]) &&
        !['India', 'Ernakulam', 'Kerala'].includes(parts[i]) &&
        parts[i].length > 3
      ) {
        locality = parts[i];
        break;
      }
    }

    // Fix case: "Kochi" appears twice → prefer "Fort Kochi"
    if (parts.includes('Fort Kochi')) {
      locality = 'Fort Kochi';
    }

    if (locality && state) return `${locality}, ${state}`;
    return state || locality || fullAddress;
  }

  public showBooking = false;

  public bookEvent() {
    this.showBooking = true;
    setTimeout(() => {
      if (this.map) {
        this.map.invalidateSize();
      }
    }, 300);
  }

  public handleBooking(data: any) {
    console.log("Booking completed:", data);
    this.showBooking = false;
  }

}
