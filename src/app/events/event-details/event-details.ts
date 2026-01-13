import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { faStar, faCalendarAlt, faClock } from '@fortawesome/free-regular-svg-icons';
import { faShareAlt, faMapMarkerAlt, faTicketAlt } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { ActivatedRoute, Route } from '@angular/router';
import { EventService } from '../../services/event/event-service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-event-details',
  imports: [FaIconComponent, DatePipe],
  templateUrl: './event-details.html',
  styleUrl: './event-details.scss'
})
export class EventDetails implements OnInit{
  private baseUrl = 'http://localhost:5000'
  public faStar = faStar;
  public faShare = faShareAlt;
  public faCalendar = faCalendarAlt;
  public faClock = faClock;
  public faMapMarker = faMapMarkerAlt;
  public faTicket = faTicketAlt;
  public event:any
  public eventBanner = ''
  

  constructor(private route:ActivatedRoute, private eventService:EventService, private cdr: ChangeDetectorRef){}
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    console.log(user);
    
    this.eventService.getEventById(id).subscribe({
      next:(res)=>{
        this.event = res;
        this.eventBanner = this.baseUrl+this.event.banners[0].url
        this.cdr.detectChanges()
        console.log(this.event);
        
      }
    })
  }
}
