import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { AuthService, LoginResponse } from 'src/app/services/auth.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user: LoginResponse | null = null;

  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    this.user = this.auth.getCurrentUser();
  }

  get displayName(): string {
    // Prefer a proper name if added later; fallback to username
    return this.user?.username || '—';
  }

  get associateId(): string {
    return StorageService.getAssociateId() || '—';
  }

  get roles(): string[] { return this.user?.roles || []; }
}
