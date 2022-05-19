import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  MessageService,
  ConfirmationService,
  ConfirmEventType,
} from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { catchError, throwError } from 'rxjs';
import { ColumnItemResponse } from '../../models/columnItem.model';
import { TaskItemResponse } from '../../models/taskItem.model';
import { ColumnsService } from '../../services/columns.service';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-column',
  templateUrl: './column.component.html',
  styleUrls: ['./column.component.scss'],
  providers: [DialogService, MessageService],
})
export class ColumnComponent {
  message: string = $localize`Do you want to delete this board?`;
  delete: string = $localize`Delete Confirmation`;
  @Input() column!: ColumnItemResponse;

  @Input() boardId!: string;

  loading = false;

  title = new FormControl('', [Validators.required]);

  editMode = false;

  constructor(
    private columnService: ColumnsService,
    private route: ActivatedRoute,
    private dataService: DataService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  onPressDeleteColumn(column: ColumnItemResponse) {
    this.confirmationService.confirm({
      message: `${this.message}`,
      header: `${this.delete}`,
      icon: 'pi pi-info-circle',
      accept: () => {
        this.dataService
          .deleteColumn(column)
          .pipe(
            catchError((error: HttpErrorResponse) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: `Column not deleted. Error: ${error.message}`,
              });
              return throwError(() => new Error(error.message));
            })
          )
          .subscribe(() => {
            setTimeout(() => {
              this.getBoard();
            }, 1000);
            this.messageService.add({
              severity: 'success',
              summary: 'Confirmed',
              detail: 'Column deleted',
            });
          });
      },
      reject: (type: ConfirmEventType) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({
              severity: 'info',
              summary: 'Cancelled',
              detail: 'You have cancelled',
            });
            break;
        }
      },
    });
  }

  getBoard() {
    this.loading = true;
    const boardId = this.route.snapshot.params['id'];
    this.dataService.getCurrentBoard(boardId).subscribe(() => {
      this.loading = false;
      this.editMode = false;
    });
  }

  onTitlePress() {
    this.title.setValue(this.column.title);
    if (!this.editMode) this.editMode = true;
  }

  closeEditMode() {
    this.editMode = false;
  }

  changeColumnTitle() {
    this.loading = true;
    this.columnService
      .updateColumn(this.boardId, this.column.id, {
        title: this.title.value,
        order: this.column.order,
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.editMode = false;
          this.loading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: `Column title don\`t updated. Error: ${error.message}`,
          });
          return throwError(() => new Error(error.message));
        })
      )
      .subscribe(() => {
        setTimeout(() => {
          this.getBoard();
        }, 1000);
        this.messageService.add({
          severity: 'success',
          summary: 'Updated',
          detail: 'Column title updated',
        });
      });
  }

  dropTask(event: CdkDragDrop<TaskItemResponse[]>, column: ColumnItemResponse) {
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
  }
}
