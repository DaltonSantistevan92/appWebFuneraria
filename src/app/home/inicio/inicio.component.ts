import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from 'src/app/auth/interfaces/auth-interface';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})
export class InicioComponent implements OnInit {
  public user!: User;

  private payloadServiceSubscription: Subscription | undefined;


  constructor(
    private _auSer : AuthService

  ) { }

  ngOnInit(): void {
    this.payloadServiceSubscription = this._auSer.$getObjSourcePayload.subscribe( (resp) => {
      this.user = resp.user;
    });

    this.user = this._auSer.tokenDecodificado.user;
  }

  ngOnDestroy(): void {
    this.payloadServiceSubscription?.unsubscribe();
  }

}
