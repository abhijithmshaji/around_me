import { CommonModule, DatePipe } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';
import { faStar as faStarSolid } from '@fortawesome/free-solid-svg-icons';
import { User } from '../../services/user/user';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-event-card',
  imports: [DatePipe, CommonModule, FaIconComponent],
  templateUrl: './event-card.html',
  styleUrl: './event-card.scss'
})
export class EventCard implements OnInit, OnChanges {
  @Input() event!: any
  public bannerUrl!: string
  public faStar = faStarRegular;
  public faStarFilled = faStarSolid;
  public isWishlisted: boolean = false;
  public faLocation = faMapMarkerAlt;

  constructor(private router: Router, private userService: User) { }
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

  public toggleWishlist() {
    const user = localStorage.getItem('user');

    if (!user) {
      this.router.navigate(['/login']);
      return;
    } else {
      this.isWishlisted = !this.isWishlisted;
      if (this.isWishlisted) {
        this.userService.addToWishlist(this.event._id).subscribe({
          next: (res) => { console.log(res); }

        });
      } else {
        this.userService.removeFromWishlist(this.event._id).subscribe();
      }
    }
  }
  public shorten(text: string, limit: number = 20): string {
  if (!text) return '';
  return text.length > limit ? text.substring(0, limit) + '...' : text;
}

}
