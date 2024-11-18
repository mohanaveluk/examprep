import { Component, Output, EventEmitter } from '@angular/core';
import { HeaderService } from '../../services/header.service';

@Component({
  selector: 'app-admin-header',
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.css']
})
export class AdminHeaderComponent {
  @Output() toggleMenu = new EventEmitter<void>();

  constructor(public headerService: HeaderService) {}
  
  onToggleMenu() {
    this.toggleMenu.emit();
  }
}