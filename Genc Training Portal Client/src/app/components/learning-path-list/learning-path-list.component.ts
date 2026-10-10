// // src/app/components/learning-path-list/learning-path-list.component.ts
 
// import { Component, OnInit, OnDestroy } from '@angular/core';
// import { MatDialog } from '@angular/material/dialog';
// import { AddLearningPathDialogComponent } from 'src/app/components/add-learning-path-dialog/add-learning-path-dialog.component';
// import { Observable, of, Subject } from 'rxjs';
// import { takeUntil } from 'rxjs/operators';
// import { CommonModule } from '@angular/common';
// import { MatButtonModule } from '@angular/material/button';
// import { MatCardModule } from '@angular/material/card';
// import { MatIconModule } from '@angular/material/icon';
// import { RouterModule } from '@angular/router';
// import { DatePipe } from '@angular/common'; // Import DatePipe for 'date' pipe
// import { LearningPath } from 'src/app/models/learningPath.model';
// import { LearningPathService } from 'src/app/services/LearningPath.service';
// import { LearningPathInterface } from 'src/app/models/interfaces/learning-path';
 
// @Component({
//   selector: 'app-learning-path-list',
//   standalone: true,
//   imports: [
//     CommonModule,
//     MatButtonModule,
//     MatCardModule,
//     MatIconModule,
//     RouterModule,
//     DatePipe // <--- Add DatePipe to imports for standalone components
//   ],
//   // REMOVED templateUrl: './learning-path-list.component.html'
//   templateUrl:'./learning-path-list.component.html',
//   styleUrls: ['./learning-path-list.component.scss'] // Assuming you have a SCSS file for this
// })
// export class LearningPathListComponent implements OnInit, OnDestroy {
 
//   learningPaths$: Observable<LearningPathInterface[]>;
//   private unsubscribe$ = new Subject<void>();
 
//   constructor(
//     private learningPathService: LearningPathService,
//     public dialog: MatDialog
//   ) {
//     // this.learningPaths$ = this.learningPathService.getLearningPaths();
//   }




 
//   ngOnInit(): void {
//     // This component is correctly set up with the async pipe.
//     this.loadSampleLearningPath();
//   }

//   loadSampleLearningPath() : void {
//     const initialData: LearningPathInterface[] = [ // Ensure this is an array []
//     {
//         id: 1,
//         serviceLineName: "Data Science", // Changed from "Selenium" as topics are DS
//         totalDurationWeeks: 3,
//         qualifierDate: new Date('2025-07-20'),
//         qualifierDay: 15,
//         interimDate: new Date('2025-08-04'),
//         interimDay: 30,
//         finalDate: new Date('2025-08-20'),
//         finalDay: 45,
//         dayDetails: [
//             { dayNumber: 1, topic: "Introduction to Data Science", description: "Definition, lifecycle, common applications, and key roles in data science." },
//             { dayNumber: 2, topic: "Python for Data Science - Basics", description: "Variables, data types, control flow, functions, and basic data structures (lists, tuples, dicts)." },
//             { dayNumber: 3, topic: "NumPy for Numerical Computing", description: "Arrays, array operations, broadcasting, and universal functions for efficient numerical computations." },
//             { dayNumber: 4, topic: "Pandas for Data Manipulation (Part 1)", description: "DataFrames, Series, indexing, selecting data, and basic data cleaning." },
//             { dayNumber: 5, topic: "Pandas for Data Manipulation (Part 2)", description: "Merging, joining, concatenating DataFrames, group by operations, and pivoting data." },
//             { dayNumber: 6, topic: "Data Visualization with Matplotlib & Seaborn", description: "Creating basic plots (line, bar, scatter, hist), customizing plots, and statistical plots." },
//             { dayNumber: 7, topic: "Introduction to SQL for Data Analysis", description: "SELECT, FROM, WHERE, GROUP BY, ORDER BY, JOIN operations for relational databases." },
//             { dayNumber: 8, topic: "Statistical Concepts for Data Science (Part 1)", description: "Descriptive statistics, probability, distributions (normal, binomial), and central limit theorem." },
//             { dayNumber: 9, topic: "Statistical Concepts for Data Science (Part 2)", description: "Hypothesis testing, p-values, confidence intervals, and A/B testing basics." },
//             { dayNumber: 10, topic: "Machine Learning Fundamentals", description: "Types of ML (supervised, unsupervised), regression vs. classification, overfitting/underfitting." },
//             { dayNumber: 11, topic: "Linear Regression and Logistic Regression", description: "Understanding simple and multiple linear regression, and logistic regression for classification." },
//             { dayNumber: 12, topic: "Decision Trees and Random Forests", description: "Ensemble methods, building and pruning decision trees, and the power of random forests." },
//             { dayNumber: 13, topic: "Support Vector Machines (SVM)", description: "Concepts of hyperplanes, margins, and kernels for classification and regression." },
//             { dayNumber: 14, topic: "Clustering Algorithms (K-Means, Hierarchical)", description: "Unsupervised learning, K-Means clustering, determining optimal K, and hierarchical clustering." },
//             { dayNumber: 15, topic: "Model Evaluation Metrics", description: "Accuracy, precision, recall, F1-score, ROC curve, confusion matrix for classification models." }
//         ]
//     },
//     { // NEW LEARNING PATH ADDED HERE
//         id: 2,
//         serviceLineName: "Full Stack Web Development",
//         totalDurationWeeks: 4, // 4 weeks = 20 days (assuming 5 days/week)
//         qualifierDate: new Date('2025-08-01'), // Example dates
//         qualifierDay: 20,
//         interimDate: new Date('2025-08-15'),
//         interimDay: 35,
//         finalDate: new Date('2025-09-01'),
//         finalDay: 50,
//         dayDetails: [
//             { dayNumber: 1, topic: "HTML5 Basics", description: "Structure, semantic elements, forms, and multimedia." },
//             { dayNumber: 2, topic: "CSS3 Fundamentals", description: "Selectors, box model, flexbox, grid, and responsive design." },
//             { dayNumber: 3, topic: "JavaScript Core Concepts (ES6+)", description: "Variables, data types, functions, arrays, objects, promises, async/await." },
//             { dayNumber: 4, topic: "DOM Manipulation & Events", description: "Interacting with HTML elements, event listeners, and common DOM APIs." },
//             { dayNumber: 5, topic: "Introduction to Git & GitHub", description: "Version control basics, branching, merging, and collaborative workflows." },
//             { dayNumber: 6, topic: "Node.js & npm Basics", description: "Server-side JavaScript, module system, and package management." },
//             { dayNumber: 7, topic: "Express.js Framework", description: "Building REST APIs, routing, middleware, and setting up a server." },
//             { dayNumber: 8, topic: "Database Fundamentals (SQL)", description: "Relational database concepts, SQL queries (CRUD), and basic schema design." },
//             { dayNumber: 9, topic: "Working with MongoDB (NoSQL)", description: "Document-oriented database, Mongoose ODM, and basic operations." },
//             { dayNumber: 10, topic: "Authentication & Authorization (Backend)", description: "User registration, login, JWT implementation, and role-based access." },
//             { dayNumber: 11, topic: "Introduction to React.js", description: "Components, JSX, props, state, and functional components." },
//             { dayNumber: 12, topic: "React Hooks & State Management", description: "useState, useEffect, useContext, and an overview of Redux/Zustand." },
//             { dayNumber: 13, topic: "React Router & Navigation", description: "Client-side routing, nested routes, and route protection." },
//             { dayNumber: 14, topic: "API Integration in React", description: "Fetching data with Axios/Fetch, error handling, and data display." },
//             { dayNumber: 15, topic: "Full Stack Project Setup", description: "Connecting React frontend to Node.js/Express backend." },
//             { dayNumber: 16, topic: "Deployment Strategies (Frontend)", description: "Deploying React apps to Netlify/Vercel." },
//             { dayNumber: 17, topic: "Deployment Strategies (Backend)", description: "Deploying Node.js apps to Heroku/AWS EC2." },
//             { dayNumber: 18, topic: "Testing Fundamentals", description: "Unit testing (Jest), integration testing, and end-to-end testing (Cypress/Playwright)." },
//             { dayNumber: 19, topic: "DevOps Basics for Full Stack", description: "CI/CD pipelines, Docker containers, and basic monitoring." },
//             { dayNumber: 20, topic: "Capstone Project Development", description: "Applying all learned concepts to build a complete full-stack application." }
//         ]
//     }
//   ];

//   this.learningPaths$ = of(initialData);

//   }
 
//   openAddLearningPathDialog(): void {
//     const dialogRef = this.dialog.open(AddLearningPathDialogComponent, {
//       width: '800px',
//       disableClose: true
//     });
//     dialogRef.afterClosed().pipe(takeUntil(this.unsubscribe$)).subscribe(result => {
//       if (result) {
//         console.log('Learning Path added/updated successfully.');
//       }
//     });
//   }
 
//   editLearningPath(path: LearningPath): void {
//       const dialogRef = this.dialog.open(AddLearningPathDialogComponent, {
//         width: '800px',
//         data: path,
//         disableClose: true
//       });
 
//       dialogRef.afterClosed().pipe(takeUntil(this.unsubscribe$)).subscribe(result => {
//           if (result) {
//               console.log('Learning Path edited successfully.');
//           }
//       });
//   }
 
//   // >>> ADD THIS DELETE METHOD <<<
//   deleteLearningPath(id: number | undefined): void {
//     if (id !== undefined) {
//       if (confirm('Are you sure you want to delete this learning path?')) {
//         this.learningPathService.deleteLearningPath(id); // Call the service method
//       }
//     }
//   }
 
//   ngOnDestroy(): void {
//     this.unsubscribe$.next();
//     this.unsubscribe$.complete();
//   }
// }
 