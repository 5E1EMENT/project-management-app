import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FilesService {
  constructor(private http: HttpClient) {}

  uploadFile(taskId: string, file: BinaryData) {
    return this.http.post(
      'file',
      {
        taskId,
        file,
      },
      {
        headers: new HttpHeaders({ 'Content-Type': 'multipart/form-data' }),
      }
    );
  }

  downloadFile(taskId: string, fileName: string) {
    return this.http.get('file/' + taskId + '/' + fileName);
  }
}
