import { CommonModule, DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
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
  @Output() wishlistChanged = new EventEmitter<{ eventId: string, isWishlisted: boolean }>();
  public bannerUrl!: string
  public faStar = faStarRegular;
  public faStarFilled = faStarSolid;
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
    const userData = localStorage.getItem('user');
    if (!userData) {
      this.router.navigate(['/login']);
      return;
    }

    const user = JSON.parse(userData);
    let wishlist: string[] = [];

    if (Array.isArray(user.wishlist)) {
      wishlist = Array.isArray(user.wishlist[0]) ? user.wishlist[0] : user.wishlist;
    }

    const eventId = this.event?._id;
    if (!eventId) return;

    // ADD
    if (!this.event.isWishlisted) {
      this.userService.addToWishlist(eventId).subscribe({
        next: () => {
          this.event.isWishlisted = true;

          if (!wishlist.includes(eventId)) {
            wishlist.push(eventId);
          }

          user.wishlist = wishlist;
          localStorage.setItem("user", JSON.stringify(user));

          // Notify parent
          this.wishlistChanged.emit({ eventId, isWishlisted: true });
        }
      });
    }

    // REMOVE
    else {
      this.userService.removeFromWishlist(eventId).subscribe({
        next: () => {
          this.event.isWishlisted = false;

          wishlist = wishlist.filter(id => id !== eventId);
          user.wishlist = wishlist;
          localStorage.setItem("user", JSON.stringify(user));

          // Notify parent
          this.wishlistChanged.emit({ eventId, isWishlisted: false });
        }
      });
    }
  }




  public shorten(text: string, limit: number = 20): string {
    if (!text) return '';
    return text.length > limit ? text.substring(0, limit) + '...' : text;
  }

  public viewDetails(){
    this.router.navigate(['/event-details',this.event._id])
  }

}
