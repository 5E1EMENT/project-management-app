import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CreateTaskItem,
  TaskItem,
  UpdateTaskItem,
} from '../models/taskItem.model';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  constructor(private http: HttpClient) {}

  getTasks(boardId: string, columnId: string): Observable<TaskItem[]> {
    return this.http.get<TaskItem[]>(
      'boards/' + boardId + '/columns/' + columnId + '/tasks'
    );
  }

  getTaskById(
    boardId: string,
    columnId: string,
    taskId: string
  ): Observable<TaskItem> {
    return this.http.get<TaskItem>(
      'boards/' + boardId + '/columns/' + columnId + '/tasks/' + taskId
    );
  }

  addTask(
    boardId: string,
    columnId: string,
    newTask: CreateTaskItem
  ): Observable<TaskItem> {
    return this.http.post<TaskItem>(
      'boards/' + boardId + '/columns/' + columnId + '/tasks',
      newTask
    );
  }

  updateTask(
    boardId: string,
    columnId: string,
    taskId: string,
    changedTask: UpdateTaskItem
  ): Observable<TaskItem> {
    return this.http.put<TaskItem>(
      'boards/' + boardId + '/columns/' + columnId + '/tasks/' + taskId,
      changedTask
    );
  }

  deleteTask(boardId: string, columnId: string, taskId: string) {
    return this.http.delete(
      'boards/' + boardId + '/columns/' + columnId + '/tasks/' + taskId
    );
  }
}
