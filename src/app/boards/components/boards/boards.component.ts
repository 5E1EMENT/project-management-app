import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  ConfirmationService,
  ConfirmEventType,
  MessageService,
} from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { BoardItem } from '../../models/boardItem.model';
import { BoardsService } from '../../services/boards.service';
import { DataService } from '../../services/data.service';
import { BoardsModalComponent } from './boards-modal/boards-modal.component';

@Component({
  selector: 'app-boards',
  templateUrl: './boards.component.html',
  styleUrls: ['./boards.component.scss'],
  providers: [MessageService, ConfirmationService, DialogService],
})
export class BoardsComponent implements OnInit {
  loading: boolean = false;
  edit: string = $localize`Edit board`;
  create: string = $localize`Create board`;
  dialogRef: any;
  message: string = $localize`Do you want to delete this board?`;
  delete: string = $localize`Delete Confirmation`;
  constructor(
    private router: Router,
    private dataService: DataService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private boardsService: BoardsService,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.getBoardsData();
  }

  getBoardsData(): void {
    this.loading = true;
    this.boardsService.getBoards().subscribe((boards) => {
      this.loading = false;
      this.dataService.boards$.next(boards);
    });
  }

  get boards$(): Observable<BoardItem[]> {
    return this.dataService.boards$;
  }

  goToBoard(id: string) {
    this.router.navigate(['/boards/', id]);
  }

  editBoard(board: BoardItem) {
    this.dialogRef = this.dialogService.open(BoardsModalComponent, {
      data: {
        board,
        mode: 'edit',
      },
      header: `${this.edit}`,
      width: '50%',
    });

    this.dialogRef.onClose.subscribe((task: BoardItem) => {
      if (task) {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          key: 'create',
          detail: `Board id: ${task.id} created`,
        });
        this.getBoardsData();
      }
    });
  }

  createBoard(): void {
    this.dialogRef = this.dialogService.open(BoardsModalComponent, {
      data: {
        mode: 'create',
      },
      header: `${this.create}`,
      width: '50%',
    });

    this.dialogRef.onClose.subscribe((task: BoardItem) => {
      if (task) {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          key: 'create',
          detail: `Board created`,
        });
      }

      this.getBoardsData();
    });
  }

  deleteBoard(id: string) {
    this.confirmationService.confirm({
      message: `${this.message}`,
      header: `${this.delete}`,
      icon: 'pi pi-info-circle',
      accept: () => {
        this.boardsService.deleteBoard(id).subscribe(() => {
          this.messageService.add({
            severity: 'info',
            summary: 'Confirmed',
            detail: 'Board deleted',
          });
          this.getBoardsData();
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
}
