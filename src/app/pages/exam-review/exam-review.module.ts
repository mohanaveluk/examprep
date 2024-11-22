import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';

//import { ExamReviewRoutingModule } from './exam-review-routing.module';
import { ReviewFormComponent } from './components/review-form/review-form.component';
import { ReviewListComponent } from './components/review-list/review-list.component';
import { ReviewDialogComponent } from './components/review-dialog/review-dialog.component';
import { StarRatingComponent } from './components/star-rating/star-rating.component';
import { ReviewRatingComponent } from './components/review-rating/review-rating.component';

@NgModule({
  declarations: [
    ReviewFormComponent,
    ReviewListComponent,
    ReviewDialogComponent,
    StarRatingComponent,
    ReviewRatingComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    MatChipsModule,
    //ExamReviewRoutingModule
  ],
  exports: [
    ReviewListComponent,
    ReviewDialogComponent,
    ReviewRatingComponent
  ]
})
export class ExamReviewModule { }