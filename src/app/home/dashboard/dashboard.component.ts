import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IntUrlActivate } from 'src/app/shared/breadcrumb/interfaces/bread.interface';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  listaUrl: IntUrlActivate[] = [];

  constructor(
    private activedRoute: ActivatedRoute,

  ) { }

  ngOnInit(): void {
    this.listaUrl = this.activedRoute.snapshot.url;

  }

}
