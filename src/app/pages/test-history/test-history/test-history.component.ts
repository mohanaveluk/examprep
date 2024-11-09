import { Component, NgModule, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { TestHistoryService, TestResult } from '../test-history.service';
import { TestDetailDialogComponent } from '../test-detail-dialog/test-detail-dialog.component';

@Component({
  selector: 'app-test-history',
  templateUrl: './test-history.component.html',
  styleUrl: './test-history.component.scss'
})
export class TestHistoryComponent {
  displayedColumns: string[] = ['takenAt', 'examTitle', 'score', 'status'];
  dataSource: MatTableDataSource<TestResult>;
  
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private testHistoryService: TestHistoryService,
    private dialog: MatDialog
  ) {
    this.dataSource = new MatTableDataSource<TestResult>([]);
  }

  ngOnInit() {
    this.loadTestHistory();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  loadTestHistory() {
    this.testHistoryService.getTestHistory().subscribe(results => {
      this.dataSource.data = results;
    });
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleString();
  }

  getStatusColor(status: string): string {
    return status === 'Pass' ? 'primary' : 'warn';
  }

  openTestDetail(result: TestResult) {
    this.dialog.open(TestDetailDialogComponent, {
      width: '600px',
      data: result
    });
  }
}
