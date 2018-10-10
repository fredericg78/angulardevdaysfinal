import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  // boolean to manage the state of the bootstrap navbar toggler
  public isCollapsed = true;

  constructor(public userService:UserService) { }

  ngOnInit() {
  }

}