import { Component, OnInit } from '@angular/core';
import {AccountService} from "../_services/account.service";
import {Observable} from "rxjs";
import {User} from "../_models/user";

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  model: any = {};

  constructor(public accountService: AccountService) { }

  ngOnInit(): void {
  }

  login() {
    console.log('model => ', this.model);
    this.accountService.login(this.model).subscribe( response => {
      console.log('response => ', response);
    }, error  => {
      console.log('error => ', error);
    } );
  }

  logout() {
    this.accountService.logout();
  }

}
