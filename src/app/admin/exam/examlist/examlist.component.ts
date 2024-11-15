import { Component, ViewChild } from '@angular/core';
import { AdminExam, ExamlistService } from '../examlist.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-examlist',
  templateUrl: './examlist.component.html',
  styleUrl: './examlist.component.scss'
})
export class ExamlistComponent {
  displayedColumns: string[] = [
    'title',
    'duration',
    'totalQuestions',
    'passingScore',
    'status',
    'updatedAt',
    'actions'
  ];
  dataSource: MatTableDataSource<AdminExam>;
  hoveredRow: any = null;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private examlistService: ExamlistService) {
    this.dataSource = new MatTableDataSource<AdminExam>([]);
  }

  ngOnInit(): void {
    this.loadExams();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  loadExams(): void {
    this.examlistService.getExams().subscribe(exams => {
      this.dataSource.data = exams;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onView(exam: AdminExam): void {
    // Implement view logic
    console.log('View exam:', exam);
  }

  onEdit(exam: AdminExam): void {
    // Implement edit logic
    console.log('Edit exam:', exam);
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
