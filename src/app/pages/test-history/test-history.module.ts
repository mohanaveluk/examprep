import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

import { TestHistoryComponent } from './test-history/test-history.component';
import { TestDetailDialogComponent } from './test-detail-dialog/test-detail-dialog.component';
import { TestHistoryRoutingModule } from './test-history-routing.module';



@NgModule({
  declarations: [
    TestHistoryComponent,
    TestDetailDialogComponent
  ],
  imports: [
    CommonModule,
    TestHistoryRoutingModule,
    MatTableModule,
    MatSortModule,
    MatDialogModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
    MatCardModule
  ]
})
export class TestHistoryModule { }
