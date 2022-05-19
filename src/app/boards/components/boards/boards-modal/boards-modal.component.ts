import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { take } from 'rxjs';
import { BoardItem } from 'src/app/boards/models/boardItem.model';
import { BoardsService } from 'src/app/boards/services/boards.service';
import { TasksService } from 'src/app/boards/services/task.service';
import { ModalType } from '../../task/modal-task/modal-task.component';

@Component({
  selector: 'app-boards-modal',
  templateUrl: './boards-modal.component.html',
  styleUrls: ['./boards-modal.component.scss'],
})
export class BoardsModalComponent implements OnInit {
  public modalForm: FormGroup;
  mode: ModalType = 'edit';
  title = new FormControl('', [Validators.required, Validators.minLength(6)]);
  description = new FormControl('', [
    Validators.required,
    Validators.minLength(20),
  ]);
  constructor(
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private boardsService: BoardsService
  ) {
    this.modalForm = new FormGroup({
      title: this.title,
      description: this.description,
    });
  }
  get isEditable(): boolean {
    return this.mode === 'edit';
  }

  editBoard(): void {
    const boardId = this.config.data.board.id;
    const boardData: BoardItem = {
      ...this.modalForm.value,
    };

    this.boardsService
      .updateBoard(boardId, boardData)
      .subscribe((board: BoardItem) => {
        this.ref.close(board);
      });
  }

  createBoard(): void {
    this.boardsService
      .addBoard(this.modalForm.value)
      .pipe(take(1))
      .subscribe((data: BoardItem) => {
        this.ref.close(data);
      });
  }

  onSubmit(): void {
    if (this.modalForm.valid) {
      if (this.isEditable) {
        this.editBoard();
        return;
      }
      this.createBoard();
    }
  }

  ngOnInit(): void {
    const board = this.config.data?.board;
    this.mode = this.config.data.mode;
    if (board) {
      this.modalForm.setValue({
        title: board.title,
        description: board.description,
      });
    }
  }
}
