import { Injectable } from '@angular/core';
import {
  catchError,
  map,
  throwError,
  switchMap,
  exhaustMap,
  take,
  Observable,
} from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Task } from '../Model/Task';
@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private baseUrl =
    'https://registrationform-87b3e-default-rtdb.firebaseio.com/tasks.json';

  constructor(private http: HttpClient, private authService: AuthService) {}

  createTask(task: Task): Observable<Task> {
    return this.authService.user.pipe(
      take(1),
      exhaustMap((user) => {
        if (!user) {
          throw new Error('User not authenticated');
        }
        return this.http.post<Task>(`${this.baseUrl}?auth=${user.token}`, task);
      })
    );
  }

  getAlltasks(): Observable<Task[]> {
    return this.authService.user.pipe(
      take(1),
      exhaustMap((user) => {
        if (!user) {
          throw new Error('User not authenticated');
        }
        return this.http.get<{ [key: string]: Task }>(
          `${this.baseUrl}?auth=${user.token}`
        );
      }),
      map((responseData) => {
        const tasksArray: Task[] = [];
        for (const key in responseData) {
          if (responseData.hasOwnProperty(key)) {
            tasksArray.push({ ...responseData[key], id: key });
          }
        }
        return tasksArray;
      })
    );
  }
}
