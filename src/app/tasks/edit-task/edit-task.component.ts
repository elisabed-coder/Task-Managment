import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';
import { AuthService } from 'src/app/Services/auth.service';
import { TaskService } from 'src/app/Services/tasks.service';
import { Comment } from 'src/app/Model/comment';

@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.scss'],
})
export class EditTaskComponent implements OnInit {
  taskId!: string | null;
  task: any;
  commentText: string = '';

  consoleMessage: string = '';
  showConsoleMessage: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private taskService: TaskService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.taskId = params.get('id');
      console.log('Editing Task ID:', this.taskId); // Debugging purpose
      if (this.taskId) {
        this.taskService.getTaskById(this.taskId).subscribe((task) => {
          this.task = task;
          console.log('Task Details:', this.task); // Debugging purpose
          this.updateCommentsArray();
        });
      }
    });
  }

  updateCommentsArray() {
    if (this.task && this.task.comments) {
      this.task.commentsArray = Object.values(this.task.comments);
    } else {
      this.task.commentsArray = [];
    }
  }
  onAddComment() {
    if (this.task && this.commentText.trim()) {
      this.authService.user.pipe(take(1)).subscribe((user) => {
        if (user) {
          // Create the new comment object
          const newComment: Comment = {
            text: this.commentText,
            author: user.email,
            date: new Date(),
          };

          // Send the new comment to the server
          this.taskService.addCommentToTask(this.taskId!, newComment).subscribe(
            (updatedTask) => {
              console.log(`updatedTask:${updatedTask}, taskid:${this.taskId}`);
              // Update the task comments with the server response
              this.task.comments = updatedTask.comments;
              this.task.commentsArray = Object.values(updatedTask);
              this.updateCommentsArray();

              // Update the array as well
              // Clear the comment input field
              this.commentText = '';
              // Optionally, you can trigger any further DOM updates here
            },
            (error) => {
              console.error('Error adding comment:', error);
              // Optionally handle errors here, such as displaying a message to the user
            }
          );
        }
      });
    }
  }
  updateTaskStatus() {
    if (this.task && this.taskId) {
      console.log(this.task);
      this.taskService.updateTask(this.task, this.taskId).subscribe(
        (updatedTask) => {
          ((this.consoleMessage = 'Task status updated successfully:'),
          (this.showConsoleMessage = true)),
            // Optionally, update local task object with the updated one
            (this.task = updatedTask);
        },
        (error) => {
          console.error('Error updating task status:', error);
        }
      );
    }
  }

  goBack() {
    this.router.navigate(['/Tasks']);
  }
}
