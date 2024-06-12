import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Task } from 'src/app/Model/Task';
import { AuthService } from 'src/app/Services/auth.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.scss'],
})
export class CreateTaskComponent implements OnInit {
  @Output()
  EmitTaskData: EventEmitter<Task> = new EventEmitter<Task>();

  @Output()
  CloseForm: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private authService: AuthService) {}

  ngOnInit(): void {}

  createTask(data: NgForm) {
    this.authService.user.pipe(take(1)).subscribe((user) => {
      if (user) {
        const newTask: Task = {
          name: data.value.name,
          status: data.value.status,
          author: user.email,
          description: data.value.description,
          priority: data.value.priority,
          date: new Date().toLocaleString(), // Corrected this line
        };

        console.log('Create task component emits:', newTask);
        // localDate: String = new Date().toLocaleString;
        this.EmitTaskData.emit(newTask);
        this.goBack();
        data.reset(); // Optionally reset the form after emitting the task
      } else {
        console.error('User not authenticated');
      }
    });
  }

  goBack() {
    this.CloseForm.emit(true);
  }
}
