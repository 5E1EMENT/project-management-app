import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/guards/auth.guard';
import { BoardComponent } from './components/board/board.component';
import { BoardsComponent } from './components/boards/boards.component';

const routes: Routes = [
  {
    path: '',
    component: BoardsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: ':id',
    component: BoardComponent,
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BoardsRouterModule {}
