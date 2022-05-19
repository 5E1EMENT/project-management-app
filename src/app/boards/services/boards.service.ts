import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  BoardItem,
  BoardItemResponse,
  CreateBoardItem,
} from '../models/boardItem.model';

@Injectable({
  providedIn: 'root',
})
export class BoardsService {
  constructor(private http: HttpClient) {}

  getBoards(): Observable<BoardItem[]> {
    return this.http.get<BoardItem[]>('boards');
  }

  getBoardById(boardId: string): Observable<BoardItemResponse> {
    return this.http.get<BoardItemResponse>('boards/' + boardId);
  }

  addBoard(newBoard: CreateBoardItem): Observable<BoardItem> {
    return this.http.post<BoardItem>('boards', newBoard);
  }

  updateBoard(
    boardId: string,
    changedBoard: CreateBoardItem
  ): Observable<BoardItem> {
    return this.http.put<BoardItem>('boards/' + boardId, changedBoard);
  }

  deleteBoard(id: string) {
    return this.http.delete('boards/' + id);
  }
}
