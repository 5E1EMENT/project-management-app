import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from '../app-routing.module';
import { HeaderComponent } from './components/header/header.component';

import { NotFoundPageComponent } from './components/not-found-page/not-found-page.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { FooterComponent } from './components/footer/footer.component';
import { BoardsModule } from '../boards/boards.module';
import { PrimengModule } from '../primeng/primeng.module';

import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { DialogModule } from '../dialog/dialog.module';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';
import { SelectButtonModule } from 'primeng/selectbutton';
import { StickyDirective } from './directives/sticky.directive';

@NgModule({
  declarations: [
    HeaderComponent,
    WelcomeComponent,
    FooterComponent,
    NotFoundPageComponent,
    StickyDirective,
  ],
  imports: [
    CommonModule,
    PrimengModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BoardsModule,
    MessagesModule,
    MessageModule,
    DialogModule,
    DragDropModule,
    SelectButtonModule,
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    PrimengModule,
    MessagesModule,
    MessageModule,
    DialogModule,
    DragDropModule,
    StickyDirective,
  ],
})
export class CoreModule {}
