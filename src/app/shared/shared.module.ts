import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';
import { LayoutModule } from '@angular/cdk/layout';

import { NavComponent } from './components/nav/nav.component';
import { FooterComponent } from './components/footer/footer.component';
import { Nav2Component } from './components/nav2/nav2.component';
import { AlertComponent } from './components/alert/alert.component';
import { SessionExpiredDialogComponent } from './components/session-expired-dialog/session-expired-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { StatCardComponent } from '../pages/inquiry/components/stat-card/stat-card.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { TruncatePipe } from './utility/truncate.pipe';
import { LoadingOverlayComponent } from './components/loading-overlay/loading-overlay.component';
import { MatProgressSpinner, MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { FaqComponent } from './components/faq/faq.component';
import { UnderConstructionComponent } from './components/under-construction/under-construction.component';


@NgModule({
  declarations: [
    NavComponent,
    FooterComponent,
    Nav2Component,
    AlertComponent,
    SessionExpiredDialogComponent,
    StatCardComponent,
    TruncatePipe,
    LoadingOverlayComponent,
    ConfirmDialogComponent,
    FaqComponent,
    UnderConstructionComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule,  
    MatCheckboxModule,
    MatRadioModule,
    MatListModule,
    MatProgressBarModule, 
    MatToolbarModule,
    MatButtonModule,
    MatMenuModule,
    MatListModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    MatExpansionModule,
    MatDividerModule,
    MatDialogModule,
    MatIconModule,
    MatDialogModule,
    MatIconModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    NgxChartsModule,
  ],
  exports: [
    NavComponent,
    FooterComponent,
    Nav2Component,
    AlertComponent,
    StatCardComponent,
    TruncatePipe,
    LoadingOverlayComponent
  ]
})
export class SharedModule { }
