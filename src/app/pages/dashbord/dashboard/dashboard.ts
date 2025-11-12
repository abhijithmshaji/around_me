import { Component,OnInit } from '@angular/core';
import { User } from '../../../services/user/user';
import { CategoryCard } from "../../../categoies/category-card/category-card";

@Component({
  selector: 'app-dashboard',
  imports: [CategoryCard],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {

  public displayName!: string

  constructor(private userService: User) {

  }
  ngOnInit(): void {
    const user = localStorage.getItem('user');
    if (user) {
      this.displayName = JSON.parse(user).name;
    }
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

  events = [
    { title: 'Lakeside Camping at Pawna', date: 'Nov 25-26', category: 'Travel', location: 'Pawna Lake', price: 1200 },
    { title: 'Sound of Christmas 2023', date: 'Dec 2', category: 'Culture', location: 'Bandra Fort', price: 500 },
    { title: 'Global Engineering Education', date: 'Dec 3', category: 'Tech', location: 'BKC, Mumbai', price: 0 },
  ];

  get filteredEvents() {
    if (this.activeTab === 'Free') return this.events.filter(e => e.price === 0);
    return this.events;
  }

  setTab(tab: string) {
    this.activeTab = tab;
  }

}
