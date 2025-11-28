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
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const noLayoutRoutes = ['/login', '/register'];

        // Normalize URL (remove query params)
        const currentUrl = event.urlAfterRedirects.split('?')[0];

        this.showLayout = !noLayoutRoutes.includes(currentUrl);
      }
    });
  }
}
