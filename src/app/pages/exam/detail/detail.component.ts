import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ExamService } from '../exam.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss'
})
export class DetailComponent {
  exam: any;

  constructor(private route: ActivatedRoute, private examService: ExamService) {}

  ngOnInit() {
    const examId = this.route.snapshot.paramMap.get('id') || '0';
    this.examService.getExam(+examId).subscribe(data => {
      this.exam = data;
    });
  }
}
