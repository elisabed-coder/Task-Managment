import { Component, OnInit } from '@angular/core';
import { AuthService } from '../Services/auth.service';
import { BehaviorSubject, exhaustMap, take } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User } from '../Model/User';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
})
export class TasksComponent implements OnInit {
  tasks: any[] = [];

  toDo!: string;
  constructor(private authService: AuthService, private http: HttpClient) {}

  ngOnInit(): void {
    this.getAllTasks();
  }

  posttaks(toDo: string) {
    this.http
      .post(
        'https://console.firebase.google.com/project/registrationform-87b3e/database/registrationform-87b3e-default-rtdb/data/~2F.json',
        toDo
      )
      .subscribe((response) => {
        console.log(response);
      });
  }

  getAllTasks() {
    // take operator will take the latest limited value and it will automatically unsubscribe from this user BehaviorSubject - take operator returns usersubject
    //exhaustMap it simply waits for the first observable to compolete(which is take operator doing) and after that it takes the result of that observable (user object) and then this exhaustMap can return a new observable, it will replace observable in this entire observable chain
    this.authService.user
      .pipe(
        take(1),
        exhaustMap((user: User | null) => {
          if (user) {
            return this.http.get<any[]>(
              `https://console.firebase.google.com/project/registrationform-87b3e/database/registrationform-87b3e-default-rtdb/data/~2F.json?auth=${user.token}`
            );
          } else {
            // Handle case where user is null
            return [];
          }
        })
      )
      .subscribe((tasks: any) => {
        this.tasks = tasks;
      });
  }
}
