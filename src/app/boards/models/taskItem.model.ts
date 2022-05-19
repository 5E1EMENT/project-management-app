import { FileItem } from './file.models';

export interface TaskItem {
  id: string;
  title: string;
  done: boolean;
  order: number;
  description: string;
  userId: string;
  boardId: string;
  columnId: string;
  files: FileItem[];
}

export interface TaskItemResponse {
  id: string;
  title: string;
  done: boolean;
  order: number;
  description: string;
  userId: string;
  files: FileItem[];
}

export interface CreateTaskItem {
  title: string;
  done: boolean;
  order: number;
  description: string;
  userId: string;
}

export interface UpdateTaskItem {
  title: string;
  done: boolean;
  order: number;
  description: string;
  userId: string;
  boardId: string;
  columnId: string;
}
