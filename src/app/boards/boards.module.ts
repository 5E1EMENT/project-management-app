import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardsComponent } from './components/boards/boards.component';
import { BoardComponent } from './components/board/board.component';
import { BoardsRouterModule } from './boards-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimengModule } from '../primeng/primeng.module';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { ColumnComponent } from './components/column/column.component';
import { TaskComponent } from './components/task/task.component';
import { ModalTaskComponent } from './components/task/modal-task/modal-task.component';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { MaxHeightDirective } from './directives/max-height.directive';
import { BoardsModalComponent } from './components/boards/boards-modal/boards-modal.component';
import { ColumnHeaderComponent } from './components/column-header/column-header.component';

@NgModule({
  declarations: [
    BoardsComponent,
    BoardComponent,
    ColumnComponent,
    TaskComponent,
    ModalTaskComponent,
    MaxHeightDirective,
    BoardsModalComponent,
    ColumnHeaderComponent,
  ],
  imports: [
    CommonModule,
    BoardsRouterModule,
    PrimengModule,
    MessageModule,
    MessagesModule,
    FormsModule,
    ReactiveFormsModule,
    ToastModule,
    ReactiveFormsModule,
  ],
  providers: [MessageService],
})
export class BoardsModule {}
