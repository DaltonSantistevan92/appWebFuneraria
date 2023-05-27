import { Component, Input, OnInit } from '@angular/core';
import { Menu } from 'src/app/auth/interfaces/auth-interface';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  @Input() menu : Menu[] = [];

  constructor() { }

  ngOnInit(): void {
    //console.log(this.menu);
    
  }

}
