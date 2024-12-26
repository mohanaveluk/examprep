import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-profile-image',
  templateUrl: './profile-image.component.html',
  styleUrl: './profile-image.component.scss'
})
export class ProfileImageComponent {
  @Input() currentImage: string | null = null;
  @Output() imageSelected = new EventEmitter<File>();
  @Output() imageRemoved = new EventEmitter<void>();

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file && file.type.match(/image\/*/) && file.size <= 5000000) {
      this.imageSelected.emit(file);
    }
  }

  removeImage(): void {
    this.imageRemoved.emit();
  }
}
