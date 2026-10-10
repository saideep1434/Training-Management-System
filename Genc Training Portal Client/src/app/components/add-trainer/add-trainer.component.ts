import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule, KeyValuePipe } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select'; // For status dropdown

import { TechTrainer, TechTrainerAdd } from 'src/app/models/TechTrainer.model';


interface DynamicFormData {
    [key: string]: string | number | boolean; // Or more specific types
  }


@Component({
    selector: 'dialog-component',
    standalone: true,
    imports: [
        CommonModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        FormsModule,
        MatSelectModule,
        KeyValuePipe // Added for status dropdown
    ],
    templateUrl: './add-trainer.component.html', // Point to the new HTML file
    styleUrls: [] // Add your styles here if needed
})


export class DialogComponent implements OnInit {
    newTrainer: TechTrainerAdd = {
        techTrainerAssociateId: '', // Use null for initial empty state for number inputs
        techTrainerName: '',
        techTrainerEmail: '',
        description: ''
    };

    private role: string;

    inputElements : {[key: string] : string[]};


    constructor(
        public dialogRef: MatDialogRef<DialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any // In case you need to pass data into the dialog
    ) { 
        this.role = data.role;
        this.inputElements = this.getInputElementsForRole(this.role);
        
    }
    
    formData: DynamicFormData = {};

    ngOnInit(): void {
        for (const key of Object.keys(this.inputElements)) {
            // Initialize with empty string or null, based on your preference for different types
            this.formData[key] = '';
        }
    }
    
    private getInputElementsForRole(role: string): {[key: string] : string[]} {
        switch (role) {
            case 'trainer':
                return {
                    techTrainerAssociateId: ['Associate ID', 'number'],
                    techTrainerName: ['Trainer Name', 'text'],
                    techTrainerEmail: ['Trainer Email', 'email'],
                    description: ['Description', 'text']
                };
            case 'coach':
                return {
                    coachAssociateId: ['Associate ID', 'number'],
                    coachName: ['Trainer Name','text'],
                    coachEmail: ['Trainer Email', 'email']
                };
            case 'bh-trainer':
                return {
                    bhTrainerAssociateId: ['Associate ID', 'number'],
                    bhTrainerName: ['BH Trainer Name', 'text'],
                    bhTrainerEmail: ['BH Trainer Email', 'email']
                };
            case 'mentor':
                return {
                    mentorAssociateId: ['Associate ID', 'number'],
                    mentorName : ['Mentor Name', 'text'],
                    mentorEmail : ['Mentor Email', 'email']
                }
            default:
                return { 
                    techTrainerAssociateId: ['Associate ID', 'number'],
                    techTrainerName: ['Trainer Name', 'text'],
                    techTrainerEmail: ['Trainer Email', 'email'],
                    description: ['Description', 'text']
                };
        }
    }

    onCancel(): void {
        this.dialogRef.close(); // Close dialog without returning data
    }

    onSave(): void {
        console.log("Data being saved from dialog:", this.formData);
        this.dialogRef.close(this.formData); // Close dialog and pass new trainer data
    }
}
