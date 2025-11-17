import { DatePipe } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-event-card',
  imports: [DatePipe],
  templateUrl: './event-card.html',
  styleUrl: './event-card.scss'
})
export class EventCard implements OnInit, OnChanges {
  @Input() event!: any
  public bannerUrl!: string
  ngOnInit() {
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['event']) {
      this.updateBannerUrl();
    }
  }

  public updateBannerUrl() {
    const baseUrl = 'http://localhost:5000';

    if (this.event?.banners?.length > 0) {
      this.bannerUrl = baseUrl + this.event.banners[0].url;
    } else {
      this.bannerUrl = 'assets/images/cat-sports.png';
    }
  }

}
