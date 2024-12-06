import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ExamSessionService } from '../../../../core/services/exam-session.service';
import { RandomQuestionResponse } from '../../../models/exam.model';

interface ReviewQuestion {
  index: number;
  question: string;
  answered: boolean;
}

interface DialogData {
  questions: ReviewQuestion[],
  sessionId: string,
  examId: string
}

@Component({
  selector: 'app-review-list-dialog',
  templateUrl: './review-list-dialog.component.html',
  styleUrls: ['./review-list-dialog.component.css']
})
export class ReviewListDialogComponent {

  reviewList : any[] = []
  constructor(
    private examSessionService: ExamSessionService,
    public dialogRef: MatDialogRef<ReviewListDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.loadReviewList();
  }

  loadReviewList(){
    this.examSessionService.getReviewList(this.data?.sessionId, this.data.examId).subscribe({
      next: (response: any) => {
        this.reviewList = response.data;
        console.log(`Review List: ${response.data}`);

      },
      error: (error) => console.error('Failed to resume exam:', error)
    });
  }

  
  goToQuestion(id: number) {
    let qguid = this.reviewList.find(x => x.id === id)?.qguid || "";
    this.dialogRef.close({id, qguid});
  }
}