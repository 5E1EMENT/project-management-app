import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  ConfirmationService,
  ConfirmEventType,
  MessageService,
} from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { ColumnItemResponse } from '../../models/columnItem.model';
import { TaskItemResponse } from '../../models/taskItem.model';
import { DataService } from '../../services/data.service';
import { TasksService } from '../../services/task.service';
import { ModalTaskComponent } from './modal-task/modal-task.component';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
  providers: [MessageService, ConfirmationService],
})
export class TaskComponent implements OnInit {
  @Input() task!: TaskItemResponse;
  @Input() column!: ColumnItemResponse;
  @Input() boardId!: string;
  dialogRef: any;
  edit: string = $localize`Edit task`;
  message: string = $localize`Do you want to delete this board?`;
  delete: string = $localize`Delete Confirmation`;
  create: string = $localize`Create task`;
  yesLabel: string = $localize`Yes`;
  noLabel: string = $localize`No`;
  done = new FormControl(true);
  constructor(
    private dialogService: DialogService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private dataService: DataService,
    private route: ActivatedRoute,
    private taskService: TasksService
  ) {}

  ngOnInit() {
    this.done.setValue(this.task.done);
  }

  deleteTask(taskId: string): void {
    this.confirmationService.confirm({
      message: `${this.message}`,
      header: `${this.delete}`,
      acceptLabel: `${this.yesLabel}`,
      rejectLabel: `${this.noLabel}`,
      icon: 'pi pi-info-circle',
      accept: () => {
        this.dataService
          .deleteTask(this.boardId, this.column.id, this.column, this.task)
          .subscribe(() => {
            this.messageService.add({
              severity: 'info',
              summary: 'Confirmed',
              detail: 'Task deleted',
              key: 'delete',
            });

            setTimeout(() => {
              this.getBoard();
            }, 1000);
          });
      },
      reject: (type: ConfirmEventType) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({
              severity: 'error',
              summary: 'Rejected',
              detail: 'You have rejected',
            });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({
              severity: 'warn',
              summary: 'Cancelled',
              detail: 'You have cancelled',
            });
            break;
        }
      },
    });
  }

  editTask(): void {
    this.dialogRef = this.dialogService.open(ModalTaskComponent, {
      data: {
        task: { ...this.task },
        columnId: this.column.id,
        boardId: this.boardId,
        userId: this.task.userId,
        mode: 'edit',
      },
      header: `${this.edit}`,
      width: 'calc(260px + 20vw)',
    });

    this.dialogRef.onClose.subscribe((task: TaskItemResponse) => {
      if (task) {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          key: 'edit',
          detail: `Task id: ${task.id} edited`,
        });
      }

      setTimeout(() => {
        this.getBoard();
      }, 1000);
    });
  }

  getBoard() {
    const boardId = this.route.snapshot.params['id'];
    this.dataService.getCurrentBoard(boardId).subscribe();
  }

  changeDone() {
    console.log(this.done.value);
    this.taskService
      .updateTask(this.boardId, this.column.id, this.task.id, {
        title: this.task.title,
        done: this.done.value,
        order: this.task.order,
        description: this.task.description,
        userId: this.task.userId,
        boardId: this.boardId,
        columnId: this.column.id,
      })
      .subscribe(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          key: 'edit',
          detail: `Task: ${this.task.title} edited`,
        });
      });
  }
}
