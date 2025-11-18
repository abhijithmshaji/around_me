import { Component, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Footer } from "./components/footer/footer";
import { Header } from "./components/header/header";
import { filter } from 'rxjs';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Footer, Header],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('Around Me');

  public showLayout = true;

  constructor(private router: Router) {
    // Watch for route changes
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        // Hide header/footer if user is on login route
        this.showLayout = !(event.urlAfterRedirects === '/login' || event.urlAfterRedirects === '/register');
      });
  }
}
