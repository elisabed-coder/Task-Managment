import { Component, OnInit } from '@angular/core';
import { AuthResponse } from '../Model/AuthResponse';
import { AuthService } from '../Services/auth.service';
import { User } from '../Model/User';
import { Subscription } from 'rxjs';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { faWindowClose } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  faBars = faBars;
  faDoorClosed = faWindowClose;
  isLoggedIn: boolean = false;
  isMenuOpen: boolean = false;
  //good practise to unsubscribe the subject
  private userSubject!: Subscription;
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    //subscribe user subject from Authservice
    this.userSubject = this.authService.user.subscribe((user: User | null) => {
      this.isLoggedIn = user ? true : false;
    });
  }

  ngOnDestroy(): void {
    this.userSubject.unsubscribe();
  }
  logOut() {
    this.authService.logOut();
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
