import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
interface City {
  name: string;
  code: string;
}
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  isLogged!: boolean;
  isActiveEn: boolean = true;
  stateOptions!: any[];
  value1: string = 'off';
  private subscription!: Subscription;
  constructor(public authService: AuthService, public router: Router) {}

  ngOnInit(): void {
    this.stateOptions = [
      { value: 'en', label: 'En' },
      { value: 'ru', label: 'Ru' },
    ];
    this.subscription = this.authService.isLogged.subscribe(
      (data) => (this.isLogged = data)
    );
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
