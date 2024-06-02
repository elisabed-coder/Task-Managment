import { Component, OnInit } from '@angular/core';
import { AuthService } from '../Services/auth.service';
import { Observable, exhaustMap, of, take } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User } from '../Model/User';
import { NgForm } from '@angular/forms';
import { TaskService } from '../Services/tasks.service';
import { Task } from '../Model/Task';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
})
export class TasksComponent implements OnInit {
  tasks: Task[] = [];

  toDo!: string;
  constructor(
    private authService: AuthService,

    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    this.FetchTasks();
  }

  createTask(data: NgForm) {
    const newTask = data.value;
    this.taskService.createTask(newTask).subscribe({
      next: () => {
        this.FetchTasks(); // Refresh the task list after creating a new task
        data.reset(); // Reset the form after task creation
      },
      error: (err) => console.error('Error creating task:', err),
    });
  }

  FetchTasks() {
    this.taskService.getAlltasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        console.log('Tasks:', this.tasks);
      },
      error: (err) => console.error('Error:', err),
    });
  }

  // getAllTasks() {
  //   // take operator will take the latest limited value and it will automatically unsubscribe from this user BehaviorSubject - take operator returns usersubject
  //   //exhaustMap it simply waits for the first observable to compolete(which is take operator doing) and after that it takes the result of that observable (user object) and then this exhaustMap can return a new observable, it will replace observable in this entire observable chain
  //   this.taskService.getAlltasks().subscribe({
  //     next: (tasks: any[]) => {
  //       this.tasks = tasks;
  //       // this.isLoading = false;
  //     },
  //     // error: (error) => {
  //     //   this.setErrorMessage(error);
  //     // },
  //   });
  // }
  //   getAllTasks() {
  //     this.http
  //       .get<any>(
  //         'https://registrationform-87b3e-default-rtdb.firebaseio.com/tasks.json'
  //       )
  //       .subscribe((response: any) => {
  //         // Convert the object into an array
  //         this.tasks = Object.keys(response).map((key) => response[key]);
  //       });
  //   }
}
