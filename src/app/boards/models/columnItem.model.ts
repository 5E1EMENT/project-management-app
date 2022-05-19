import { TaskItemResponse } from './taskItem.model';

export interface ColumnItem {
  id: string;
  title: string;
  order: number;
}

export interface ColumnItemResponse {
  id: string;
  title: string;
  order: number;
  tasks: TaskItemResponse[];
}

export interface CreateColumnItem {
  title: string;
  order: number;
}
