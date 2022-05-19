import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  ConfirmationService,
  ConfirmEventType,
  MessageService,
} from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { catchError, throwError } from 'rxjs';
import { ColumnItemResponse } from '../../models/columnItem.model';
import { ColumnsService } from '../../services/columns.service';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-column-header',
  templateUrl: './column-header.component.html',
  styleUrls: ['./column-header.component.scss'],
  providers: [DialogService, MessageService],
})
export class ColumnHeaderComponent {
  message: string = $localize`Do you want to delete this board?`;
  delete: string = $localize`Delete Confirmation`;
  yesLabel: string = $localize`Yes`;
  noLabel: string = $localize`No`;
  @Input() column!: ColumnItemResponse;

  @Output() loadingColumnEvent = new EventEmitter<{
    loading: boolean;
    columnId: string;
  }>();

  editMode = false;

  titleColumn = new FormControl('', [Validators.required]);

  boardId = this.route.snapshot.params['id'];

  constructor(
    private confirmationService: ConfirmationService,
    private dataService: DataService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private columnService: ColumnsService
  ) {}

  onTitlePress(column: ColumnItemResponse) {
    this.titleColumn.setValue(column.title);
    if (!this.editMode) this.editMode = true;
  }

  onPressDeleteColumn(column: ColumnItemResponse) {
    this.confirmationService.confirm({
      message: `${this.message}`,
      header: `${this.delete}`,
      acceptLabel: `${this.yesLabel}`,
      rejectLabel: `${this.noLabel}`,
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
              this.getBoardOfColumn();
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

  getBoardOfColumn() {
    this.loadingColumnEvent.emit({ loading: true, columnId: this.column.id });
    const boardId = this.route.snapshot.params['id'];
    this.dataService.getCurrentBoard(boardId).subscribe(() => {
      this.loadingColumnEvent.emit({
        loading: false,
        columnId: this.column.id,
      });
      this.editMode = false;
    });
  }

  changeColumnTitle(column: ColumnItemResponse) {
    this.loadingColumnEvent.emit({ loading: true, columnId: this.column.id });
    this.columnService
      .updateColumn(this.boardId, column.id, {
        title: this.titleColumn.value,
        order: column.order,
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.editMode = false;
          this.loadingColumnEvent.emit({
            loading: false,
            columnId: this.column.id,
          });
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
          this.getBoardOfColumn();
        }, 1000);
        this.messageService.add({
          severity: 'success',
          summary: 'Updated',
          detail: 'Column title updated',
        });
      });
  }

  closeEditMode() {
    this.editMode = false;
  }
}
