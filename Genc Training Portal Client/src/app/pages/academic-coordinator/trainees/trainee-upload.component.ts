import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TraineeService, TraineeDto } from 'src/app/services/trainee.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

interface RowDraft {
  traineeName: string;
  traineeAssociateId: string;
  traineeEmail: string;
  domainName?: string;
  skills?: string;
}

@Component({
  selector: 'app-trainee-upload',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatButtonModule, MatTableModule, MatSnackBarModule],
  templateUrl: './trainee-upload.component.html'
})
export class TraineeUploadComponent implements OnDestroy {
  rows: RowDraft[] = [];
  displayed = ['name','associate','email','domain','skills'];
  uploading = false;
  private destroy$ = new Subject<void>();

  constructor(private service: TraineeService, private snack: MatSnackBar) {}

  onFile(ev: Event) {
    const file = (ev.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result || '');
      this.rows = this.parseCsv(text);
      if (!this.rows.length) this.snack.open('No rows parsed. Check CSV.', 'Dismiss', { duration: 3000 });
    };
    reader.readAsText(file);
  }

  parseCsv(text: string): RowDraft[] {
    const lines = text.split(/\r?\n/).filter(l => l.trim().length);
    if (!lines.length) return [];
    const headers = lines[0].split(',').map(h => h.trim());
    const idx = (k: string) => headers.findIndex(h => h === k);
    const iName = idx('traineeName');
    const iAssoc = idx('traineeAssociateId');
    const iEmail = idx('traineeEmail');
    const iDomain = idx('domainName');
    const iSkills = idx('skills');
    if (iName<0 || iAssoc<0 || iEmail<0) return [];
    const rows: RowDraft[] = [];
    for (let line of lines.slice(1)) {
      const cols = line.split(',');
      if (!cols[iName] || !cols[iAssoc] || !cols[iEmail]) continue;
      rows.push({
        traineeName: cols[iName].trim(),
        traineeAssociateId: cols[iAssoc].trim(),
        traineeEmail: cols[iEmail].trim(),
        domainName: iDomain>=0 ? cols[iDomain].trim() : undefined,
        skills: iSkills>=0 ? cols[iSkills].trim() : undefined,
      });
    }
    return rows;
  }

  upload() {
    if (!this.rows.length) return;
    this.uploading = true;
    let completed = 0; let failed = 0;
    const submitNext = () => {
      const row = this.rows[completed+failed];
      if (!row) { this.done(completed, failed); return; }
      this.service.addTrainee({ ...row, cohortId: null } as any)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => { completed++; submitNext(); },
          error: () => { failed++; submitNext(); }
        });
    };
    submitNext();
  }

  private done(ok: number, fail: number) {
    this.uploading = false;
    this.snack.open(`Upload complete. Success: ${ok}, Failed: ${fail}`, 'OK', { duration: 3500 });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
