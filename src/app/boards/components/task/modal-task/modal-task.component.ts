import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import {
  TaskItemResponse,
  UpdateTaskItem,
} from 'src/app/boards/models/taskItem.model';
import { TasksService } from 'src/app/boards/services/task.service';

export type ModalType = 'edit' | 'create';

@Component({
  selector: 'app-modal-task',
  templateUrl: './modal-task.component.html',
  styleUrls: ['./modal-task.component.scss'],
  providers: [MessageService],
})
export class ModalTaskComponent implements OnInit {
  public modalForm: FormGroup;
  mode: ModalType = 'edit';
  title = new FormControl('', [Validators.required, Validators.minLength(6)]);
  description = new FormControl('', [
    Validators.required,
    Validators.minLength(20),
  ]);
  done = new FormControl(false, [Validators.required]);

  constructor(
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private taskService: TasksService
  ) {
    this.modalForm = new FormGroup({
      title: this.title,
      description: this.description,
      done: this.done,
    });
  }

  get isEditable(): boolean {
    return this.mode === 'edit';
  }

  get isCreatable(): boolean {
    return this.mode === 'create';
  }

  editTask(): void {
    const taskId = this.config.data.task.id;
    const taskData: UpdateTaskItem = {
      userId: this.config.data.userId,
      boardId: this.config.data.boardId,
      columnId: this.config.data.columnId,
      order: this.config.data.task.order,
      ...this.modalForm.value,
    };

    this.taskService
      .updateTask(taskData.boardId, taskData.columnId, taskId, taskData)
      .subscribe((task: TaskItemResponse) => {
        this.ref.close(task);
      });
  }

  onSubmit(): void {
    if (this.modalForm.valid) {
      if (this.isEditable) {
        this.editTask();
        return;
      }
    }
  }

  ngOnInit(): void {
    const task = this.config.data?.task;
    this.mode = this.config.data.mode;
    if (task) {
      this.modalForm.setValue({
        title: task.title,
        description: task.description,
        done: task.done,
      });
    }
  }
}
