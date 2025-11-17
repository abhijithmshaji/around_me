import { Component, Input, input } from '@angular/core';

@Component({
  selector: 'app-event-card',
  imports: [],
  templateUrl: './event-card.html',
  styleUrl: './event-card.scss'
})
export class EventCard {
  @Input() event!:any
  public bannerUrl!: string
  ngOnInit() {
  const baseUrl = 'http://localhost:5000';

  if (this.event?.banners?.length > 0) {
    this.bannerUrl = baseUrl + this.event.banners[0].url;
  } else {
    this.bannerUrl = 'assets/images/cat-sports.png';
  }

  // this.formatDate();
}
}
