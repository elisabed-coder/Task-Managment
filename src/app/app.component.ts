import { Component, OnInit } from '@angular/core';
import { AuthService } from './Services/auth.service';
import { Title } from '@angular/platform-browser';
import {} from '@fortawesome/fontawesome-svg-core';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'registration';
  constructor(private authService: AuthService, private titleService: Title) {}
  ngOnInit(): void {
    this.authService.autoLogin();
    this.titleService.setTitle('Task Management');
  }
}
