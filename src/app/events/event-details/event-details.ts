import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { faStar, faCalendarAlt, faClock } from '@fortawesome/free-regular-svg-icons';
import { faShareAlt, faMapMarkerAlt, faTicketAlt } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { ActivatedRoute, Route } from '@angular/router';
import { EventService } from '../../services/event/event-service';
import { DatePipe } from '@angular/common';
import * as L from 'leaflet';

@Component({
  selector: 'app-event-details',
  imports: [FaIconComponent, DatePipe],
  templateUrl: './event-details.html',
  styleUrl: './event-details.scss'
})
export class EventDetails implements OnInit {
  private baseUrl = 'http://localhost:5000'
  public faStar = faStar;
  public faShare = faShareAlt;
  public faCalendar = faCalendarAlt;
  public faClock = faClock;
  public faMapMarker = faMapMarkerAlt;
  public faTicket = faTicketAlt;
  public event: any
  public eventBanner = ''
  private map: L.Map | null = null;


  constructor(private route: ActivatedRoute, private eventService: EventService, private cdr: ChangeDetectorRef) { }
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    console.log(user);

    this.eventService.getEventById(id).subscribe({
      next: (res) => {
        this.event = res;
        this.eventBanner = this.baseUrl + this.event.banners[0].url
        if (this.event?.location) {
          this.showMapFromAddress(this.event.location);
        }
        this.cdr.detectChanges()
        console.log(this.event);

      }
    })
  }

  // ngAfterViewInit() {
  //   // Try map load after UI renders
  //   setTimeout(() => {
  //     if (this.event?.location) {
  //       this.loadMapFromAddress(this.event.location);
  //     }
  //   }, 100);
  // }
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

  // Example extraction logic:
  // [..., "Fort Kochi", "Kochi", "Ernakulam", "Kerala", "682001", "India"]

  let city = '';
  let state = '';

  // Try to detect city
  for (let p of parts) {
    if (
      !p.match(/\d/) && // skip numbers like pincode
      p !== 'India' &&
      p.length > 3
    ) {
      city = p;
      break;
    }
  }

  // Last meaningful part before pincode and "India"
  for (let i = parts.length - 1; i >= 0; i--) {
    if (
      !parts[i].match(/\d/) &&
      parts[i] !== 'India' &&
      parts[i].length > 3
    ) {
      state = parts[i];
      break;
    }
  }

  if (city && state) return `${city}, ${state}`;
  if (city) return city;

  return fullAddress; // fallback
}

}
