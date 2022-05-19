import { ColumnItemResponse } from './columnItem.model';

export interface BoardItem {
  id: string;
  title: string;
  description: string;
}

export interface CreateBoardItem {
  title: string;
  description: string;
}

export interface BoardItemResponse {
  id: string;
  title: string;
  description: string;
  columns: ColumnItemResponse[];
}
