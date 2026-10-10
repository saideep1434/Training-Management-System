import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BulkRowResult, TraineeService } from 'src/app/services/trainee.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage.service';
import { MatIconModule } from '@angular/material/icon';

interface RowDraft {
  traineeName: string;
  traineeAssociateId: string;
  traineeEmail: string;
  domainName?: string;
  skills?: string;
}

@Component({
  selector: 'app-trainee-upload-common',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatButtonModule, MatTableModule, MatSnackBarModule, MatIconModule],
  templateUrl: './trainee-upload.component.html'
})
export class TraineeUploadCommonComponent implements OnInit, OnDestroy {
  isReadOnly = false;
  rows: RowDraft[] = [];
  displayed = ['name','associate','email','domain','skills'];
  uploading = false;
  savedAt: string | null = null;
  report: BulkRowResult[] | null = null;
  updateExisting = true; // controls whether existing matches should be updated on upload
  private destroy$ = new Subject<void>();

  // Computed data source for the report table to avoid inline arrow functions in template bindings
  get filteredReport(): BulkRowResult[] {
    return (this.report ?? []).filter(
      (r) => r.status === 'FAILED' || r.status === 'SKIPPED'
    );
  }

  constructor(private service: TraineeService, private snack: MatSnackBar, private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.isReadOnly = StorageService.isReadOnly();
    if (this.isReadOnly) {
      this.snack.open('Cannot access upload page. Guest users have read-only access.', 'Close', {
        duration: 4000
      });
      // Navigate back to list
      this.router.navigate(['../list'], { relativeTo: this.route });
      return;
    }
    this.loadDraft();
  }

  onFile(ev: Event) {
    const file = (ev.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result || '');
      this.rows = this.parseCsv(text);
      if (!this.rows.length) this.snack.open('No rows parsed. Check CSV.', 'Dismiss', { duration: 3000 });
      this.savedAt = null; // new file parsed; not yet saved
    };
    reader.readAsText(file);
  }

  parseCsv(text: string): RowDraft[] {
    // Normalize line endings and strip UTF-8 BOM if present
    const normalized = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    const lines = normalized.split('\n').filter(l => l.length);
    if (!lines.length) return [];
    const rawHeader = lines[0].replace(/^\uFEFF/, '');
    const headers = this.splitCsvLine(rawHeader).map(h => h.trim());
    const idx = (k: string) => headers.findIndex(h => h.toLowerCase() === k.toLowerCase());
    const iName = idx('traineeName');
    const iAssoc = idx('traineeAssociateId');
    const iEmail = idx('traineeEmail');
    const iDomain = idx('domainName');
    const iSkills = idx('skills');
    if (iName < 0 || iAssoc < 0 || iEmail < 0) return [];
    const rows: RowDraft[] = [];
    for (const line of lines.slice(1)) {
      if (!line.trim()) continue;
      const cols = this.splitCsvLine(line);
      const name = cols[iName]?.trim();
      const assoc = cols[iAssoc]?.trim();
      const email = cols[iEmail]?.trim();
      if (!name || !assoc || !email) continue; // required fields
      rows.push({
        traineeName: name,
        traineeAssociateId: assoc,
        traineeEmail: email,
        domainName: iDomain >= 0 ? (cols[iDomain]?.trim() || undefined) : undefined,
        skills: iSkills >= 0 ? (cols[iSkills]?.trim() || undefined) : undefined,
      });
    }
    return rows;
  }

  // Minimal CSV splitter with quote support (handles commas within quotes and escaped quotes)
  private splitCsvLine(line: string): string[] {
    const out: string[] = [];
    let cur = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') { // escaped quote
          cur += '"';
          i++;
        } else { 
          inQuotes = !inQuotes;
        }
      } else if (ch === ',' && !inQuotes) {
        out.push(cur);
        cur = '';
      } else {
        cur += ch;
      }
    }
    out.push(cur);
    return out;
  }

  upload() {
    // Submit all parsed rows in a single request using the bulk-upsert API.
    // Server-side matching: associateId first, then email. Existing rows are updated (updateExisting=true).
    // We pass cohortId as null here; assignment can be done later from the list page.
    if (!this.rows.length) return;
    this.uploading = true;
    const payload = this.rows.map(r => ({ ...r, cohortId: null }));
    this.service.bulkUpsert(payload, this.updateExisting)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.uploading = false;
          // Server message includes Created/Updated/Skipped/Failed counts
          this.snack.open(res.message || 'Bulk upload complete', 'OK', { duration: 3500 });
          this.report = res.bulkResults || null;
        },
        error: () => {
          this.uploading = false;
          this.snack.open('Bulk upload failed', 'Dismiss', { duration: 3000 });
        }
      });
  }

  private done(ok: number, fail: number) {
    this.uploading = false;
    this.snack.open(`Upload complete. Success: ${ok}, Failed: ${fail}`, 'OK', { duration: 3500 });
  }

  goBack() {
    this.router.navigate(['../list'], { relativeTo: this.route });
  }

  // --- Local Storage Draft Management ---
  private draftKey(): string { return 'trainee-upload-draft'; }

  saveDraft() {
    try {
      localStorage.setItem(this.draftKey(), JSON.stringify({ rows: this.rows, savedAt: new Date().toISOString() }));
      this.savedAt = new Date().toLocaleString();
      this.snack.open('Draft saved locally', 'OK', { duration: 2000 });
    } catch {
      this.snack.open('Failed to save draft', 'Dismiss', { duration: 2500 });
    }
  }

  loadDraft() {
    try {
      const raw = localStorage.getItem(this.draftKey());
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed?.rows)) {
        this.rows = parsed.rows as RowDraft[];
        this.savedAt = parsed.savedAt ? new Date(parsed.savedAt).toLocaleString() : null;
        this.snack.open('Loaded saved draft', 'OK', { duration: 2000 });
      }
    } catch {
      // ignore malformed
    }
  }

  clearDraft() {
    localStorage.removeItem(this.draftKey());
    this.savedAt = null;
    this.snack.open('Draft cleared', 'OK', { duration: 2000 });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
