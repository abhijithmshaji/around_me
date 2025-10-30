import { Component, OnInit } from '@angular/core';
import { User } from '../../services/user/user';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit{

  constructor(private userService:User){}
  ngOnInit(): void {
    this.userService.getUsers().subscribe({
      next:(res)=>{
        console.log(res);
        
      }
    })
  }

}
