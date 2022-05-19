import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { BoardItemResponse } from '../../models/boardItem.model';
import { ColumnItemResponse } from '../../models/columnItem.model';
import { CreateTaskItem, TaskItemResponse } from '../../models/taskItem.model';
import { ColumnsService } from '../../services/columns.service';
import { DataService } from '../../services/data.service';
import { TasksService } from '../../services/task.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
  providers: [DialogService, MessageService],
})
export class BoardComponent implements OnInit {
  loading = true;

  displayModalNewColumn = false;

  displayModalNewTask = false;

  title = new FormControl('', [Validators.required, Validators.minLength(6)]);

  taskTitle = new FormControl('', [
    Validators.required,
    Validators.minLength(6),
  ]);

  taskDescription = new FormControl('', [
    Validators.required,
    Validators.minLength(20),
  ]);

  taskColumnId = new FormControl(null, [Validators.required]);

  taskForm!: FormGroup;

  columns!: ColumnItemResponse[];

  boardId = this.route.snapshot.params['id'];

  loadingColumn = false;

  loadingColumnId = '';

  editMode = false;

  constructor(
    private route: ActivatedRoute,
    private columnService: ColumnsService,
    private dataService: DataService,
    private messageService: MessageService,
    private tasksService: TasksService,
    private authService: AuthService
  ) {
    this.taskForm = new FormGroup({
      taskTitle: this.taskTitle,
      taskDescription: this.taskDescription,
      taskColumnId: this.taskColumnId,
    });
  }

  ngOnInit() {
    this.getBoard();

    this.dataService.board$.subscribe(
      (board) => (this.columns = board.columns)
    );
  }

  get board$(): Observable<BoardItemResponse> {
    return this.dataService.board$;
  }

  addColumn() {
    this.loading = true;
    const newColumnTitle = this.title.value;
    const newColumnOrder = this.getNewColumnOrder();
    this.columnService
      .addColumn(this.dataService.board.id, {
        title: newColumnTitle,
        order: newColumnOrder,
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.displayModalNewColumn = false;
          this.loading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: `Column not added. Error: ${error.message}`,
          });
          return throwError(() => new Error(error.message));
        })
      )
      .subscribe(() => {
        this.getBoard();
        this.displayModalNewColumn = false;
        this.loading = false;
        this.title.reset();
        this.messageService.add({
          severity: 'success',
          summary: 'Confirmed',
          detail: 'Column Created',
        });
      });
  }

  addTask() {
    this.loading = true;
    const taskColumnId = this.taskColumnId.value;
    const newTaskOrder = this.getNewTaskOrder(taskColumnId);
    const newTask: CreateTaskItem = {
      title: this.taskTitle.value,
      done: false,
      order: newTaskOrder,
      description: this.taskDescription.value,
      userId: this.authService.getUserId() || '',
    };
    this.tasksService
      .addTask(this.dataService.board.id, taskColumnId, newTask)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.displayModalNewTask = false;
          this.loading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: `Task not added. Error: ${error.message}`,
          });
          return throwError(() => new Error(error.message));
        })
      )
      .subscribe(() => {
        this.getBoard();
        this.displayModalNewTask = false;
        this.loading = false;
        this.taskForm.reset();
        this.messageService.add({
          severity: 'success',
          summary: 'Confirmed',
          detail: 'Task Created',
        });
      });
  }

  getBoard() {
    this.loading = true;
    const boardId = this.route.snapshot.params['id'];
    this.dataService.getCurrentBoard(boardId).subscribe(() => {
      this.loading = false;
    });
  }

  getNewColumnOrder() {
    return (
      this.dataService.board.columns.reduce(
        (acc, column) => (acc > column.order ? acc : column.order),
        0
      ) + 1
    );
  }

  getNewTaskOrder(columnId: string) {
    const column = this.dataService.board.columns.find(
      (column) => column.id === columnId
    );
    if (column === undefined) return 1;
    return (
      column.tasks.reduce(
        (acc, task) => (acc > task.order ? acc : task.order),
        0
      ) + 1
    );
  }

  dropColumn(event: CdkDragDrop<ColumnItemResponse[]>) {
    if (event.previousIndex === event.currentIndex) return;

    this.dataService
      .replaceColumn(event.previousIndex + 1, event.currentIndex + 1)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: `Column not replaced. Error: ${error.message}`,
          });
          return throwError(() => new Error(error.message));
        })
      )
      .subscribe(() => {
        this.getBoard();
        this.messageService.add({
          severity: 'info',
          summary: 'Confirmed',
          detail: 'Column replaced',
        });
      });

    moveItemInArray(
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );
  }

  dropTask(event: CdkDragDrop<TaskItemResponse[]>, column: ColumnItemResponse) {
    if (event.previousContainer === event.container) {
      if (event.previousIndex === event.currentIndex) return;

      this.dataService
        .replaceTask(event.previousIndex + 1, event.currentIndex + 1, column)
        .pipe(
          catchError((error: HttpErrorResponse) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: `Task not replaced. Error: ${error.message}`,
            });
            return throwError(() => new Error(error.message));
          })
        )
        .subscribe(() => {
          setTimeout(() => {
            this.getBoard();
          }, 1000);
          this.messageService.add({
            severity: 'info',
            summary: 'Confirmed',
            detail: 'Task replaced',
          });
        });

      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      this.dataService
        .replaceTaskBetweenColumns(event, column)
        .pipe(
          catchError((error: HttpErrorResponse) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: `Task not replaced. Error: ${error.message}`,
            });
            return throwError(() => new Error(error.message));
          })
        )
        .subscribe(() => {
          setTimeout(() => {
            this.getBoard();
          }, 1000);
          this.messageService.add({
            severity: 'info',
            summary: 'Confirmed',
            detail: 'Task replaced',
          });
        });

      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }
}
