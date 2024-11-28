import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CategoryService } from '../services/category.service';
import { Category } from '../models/category.model';
import { CategoryDialogComponent } from '../category-dialog/category-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent implements OnInit {
  categories: Category[] = [];
  displayedColumns: string[] = ['name', 'description', 'createdAt', 'actions'];

  constructor(
    private categoryService: CategoryService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe(
      (categoryList: any) => this.categories = categoryList.data
    );
  }

  openDialog(category?: Category): void {
    const dialogRef = this.dialog.open(CategoryDialogComponent, {
      width: '400px',
      data: category || {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.id) {
          this.categoryService.updateCategory(result.id, result).subscribe(() => {
            this.snackBar.open('Category updated successfully', 'Close', { duration: 3000 });
            this.loadCategories();
          });
        } else {
          this.categoryService.addCategory(result).subscribe(() => {
            this.snackBar.open('Category added  successfully', 'Close', { duration: 3000 });
            this.loadCategories();
          });
        }
      }
    });
  }

  deleteCategory(id: string): void {
    if (confirm('Are you sure you want to delete this category?')) {
      this.categoryService.deleteCategory(id).subscribe(() => {
        this.snackBar.open('Category deleted successfully', 'Close', { duration: 3000 });
        this.loadCategories();
      });
    }
  }
}