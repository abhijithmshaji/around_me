import { ChangeDetectorRef, Component, Input, input, OnInit } from '@angular/core';
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { DatePipe } from '@angular/common';
import { EventService } from '../../services/event/event-service';

@Component({
  selector: 'app-event-list',
  imports: [FaIconComponent, DatePipe],
  templateUrl: './event-list.html',
  styleUrl: './event-list.scss'
})
export class EventList implements OnInit {

  public eventsList: any[] = []

  constructor(private eventService: EventService, private cdr: ChangeDetectorRef) {

  }
  ngOnInit(): void {
    this.eventService.getEvents().subscribe({
      next: (res) => {
        this.eventsList = res;
        console.log(this.eventsList);
        this.cdr.detectChanges()
      }
    })

  }

  public getEvents() {
    this.eventService.getEvents().subscribe({
      next: (res) => {
        this.eventsList = res;
        console.log(this.eventsList);
        this.cdr.detectChanges()
      }
    })
  }

  faEdit = faPen;
  faTrash = faTrash;

  public editEvent(id: string) { }

  public deleteEvent(id: string) {
    this.eventService.deleteEvet(id).subscribe({
      next: (res) => {
        console.log(res);
      },
      complete: () => {
      }
    })
  }
}
