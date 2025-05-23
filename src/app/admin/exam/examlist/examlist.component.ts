import { Component, OnInit, ViewChild } from '@angular/core';
import { AdminExam, ExamlistService } from '../examlist.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { ExamDialogComponent } from '../exam-dialog/exam-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { HeaderService } from '../../services/header.service';

@Component({
  selector: 'app-examlist',
  templateUrl: './examlist.component.html',
  styleUrl: './examlist.component.scss'
})
export class ExamlistComponent implements OnInit{
  displayedColumns: string[] = [
    'title',
    'category',
    'duration',
    'totalQuestions',
    'passingScore',
    'status',
    'updatedAt',
    'actions'
  ];
  dataSource: MatTableDataSource<AdminExam>;
  hoveredRow: any = null;
  loading = false;
  loadingMessage = "Loading...";
  
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private headerService: HeaderService,
    private examlistService: ExamlistService,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.dataSource = new MatTableDataSource<AdminExam>([]);
  }

  ngOnInit(): void {
    this.headerService.setTitle("Admin - Exam");
    this.loadExams();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  loadExams(): void {
    this.examlistService.getExams().subscribe((exams: any) => {
      if(exams.success){
        let exdata = exams.data;
        exdata.forEach((item: { categoryText: any; category: { name: any; }; }) => {
          item.categoryText = item.category.name;
        });
        this.dataSource.data = exdata;
      }
    }, (error) => {
      this.dataSource.data = [];
      console.log(error);
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onView(exam: AdminExam): void {
    this.dialog.open(ExamDialogComponent, {
      width: '900px',
      data: exam
    });
  }

  onRowClick(event: MouseEvent, row: any) {
    const target = event.target as HTMLElement;
    if (!target.closest('.mat-mdc-cell:last-child')) {
      this.dialog.open(ExamDialogComponent, {
        width: '900px',
        data: row
      });
    }
  }


  onEdit(exam: AdminExam): void {
    this.router.navigate(['/admin/exam/update'], { 
      queryParams: { id: exam.id, mode: 'edit' }
    });
  }

  onEditQuestion(exam: AdminExam): void {
    this.router.navigate([`/admin/exam/question/${exam.id}`], { 
      queryParams: { mode: 'edit' }
    });
  }

  onDelete(exam: AdminExam): void {
    if (confirm(`Are you sure you want to delete "${exam.title}"?`)) {
      this.examlistService.deleteExam(exam.id).subscribe(success => {
        if (success) {
          this.loadExams();
        }
      });
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString();
  }

  getStatusColor(status: string): string {
    return status === 'active' ? 'primary' : 'warn';
  }
}
